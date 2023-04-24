import { Observable } from "rxjs/internal/Observable";
import { Usuario } from "./Usuario";

export class Recurso {
  id: number;
  descricao: string;
  nomeArquivo: string;
  arquivo: string;
  dataCadastro: string;
  status: number;
  usuarioId: string;
}