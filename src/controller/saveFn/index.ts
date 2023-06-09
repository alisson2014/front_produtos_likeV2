import { HasId, method } from "interface";
import { httpRequester } from "service/httpRequester";
import Swal from "sweetalert2";

export function saveFn<T extends HasId>(file: string, data: T): void {
  let method: method = "POST";
  if (data.id !== "") method = "PUT";

  httpRequester({ method: method, file: file, data: data }).then((res) => {
    if (res?.status === "success") {
      Swal.fire("Sucesso!", res?.message, "success").then((res) => {
        if (res.isConfirmed) {
          localStorage.setItem(file, JSON.stringify([]));
        }
      });
    } else {
      Swal.fire(
        "Erro!",
        res?.message ?? "Erro ao acessar o servidor",
        "error"
      ).then((res) => res.isConfirmed && window.location.reload());
    }
  });
}
