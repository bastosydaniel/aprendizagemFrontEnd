import { Component, OnInit } from '@angular/core';
import { format } from 'path';
import { Recurso } from 'src/app/models/Recurso';
import { Usuario } from 'src/app/models/Usuario';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { RecursoService } from 'src/app/services/recurso.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-usuario-recursos',
  templateUrl: './usuario-recursos.component.html',
  styleUrls: ['./usuario-recursos.component.css']
})
export class UsuarioRecursosComponent implements OnInit {


  recursos: Recurso[];
  uploadedFiles: any[] = [];
  loading: boolean = true;
  idUsuarioLogado: string;
  maxFileSize: number = 1000000;
  usuario: Usuario;
  visible: any;
  filteredItems: Recurso[];

  constructor(
    private recursoService: RecursoService,
    private authGuardService: AuthGuardService,
    private usuarioService: UsuariosService,
  ) { }

  ngOnInit(): void {


    this.idUsuarioLogado = this.authGuardService.getIdUsuarioLogado();

    this.recursoService.ObterRecursoPeloUsuarioId(this.idUsuarioLogado).subscribe(resultado => {
      this.recursos = resultado;
    })

    this.usuarioService.ObterUsuarioPorId(this.idUsuarioLogado).subscribe(resultado => {
      this.usuario = resultado;
    })

  }

  //TODO!: Filtrar por nome do arquivo
  // filterGlobal(value: any) {
  //   console.log(value);
  //   // Filtrar um array de objetos com uma propriedade "name"
  //   this.recursos = this.recursos.filter(item => item.nomeArquivo.toLowerCase().includes(value.toLowerCase()));
  // }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  onUpload(item: any) {
    const fileReader = new FileReader();


    for (let file of item.files) {
      fileReader.onload = (e) => {
        const arquivo = e.target?.result as string;
        const formatAquivo = arquivo.split(',')[1];

        const Recurso = {
          id: 7,
          descricao: "",
          nomeArquivo: file.name,
          arquivo: formatAquivo,
          dataCadastro: new Date().toISOString(),
          status: 1,
          usuarioId: this.idUsuarioLogado,
        };

        this.recursoService.SalvarRecurso(Recurso).subscribe({
          next: (response) => {
            this.closeDialog();
            Swal.fire({
              title: 'Sucesso!',
              text: 'Seu recurso foi salvo com sucesso.',
              icon: 'success',
              confirmButtonText: 'OK',
              focusConfirm: false
            }).then(() => {
              console.log(response);
              location.reload();
            });
          },
          error: (error) => {
            this.closeDialog();
            Swal.fire({
              title: 'Erro!',
              text: 'Não foi possível salvar seu recurso.',
              icon: 'error',
              confirmButtonText: 'OK',
              focusConfirm: false
            });
          }
        });
      }

      fileReader.readAsDataURL(file);
    }
  }

  onDelete(event: any) {
    const id = event.id
    this.recursoService.DeletarRecurso(id).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Sucesso!',
          text: 'Seu recurso foi deletado com sucesso.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          console.log(response);
          location.reload();
        });
      }
    });
  }

  ondownload(event: any) {
    const arquivo = event.arquivo
    const nomeArquivo = event.nomeArquivo

    this.decodeBase64ToFile(arquivo, nomeArquivo);

  }

  decodeBase64ToFile(base64String: string, fileName: string) {
    const binaryString = atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}


