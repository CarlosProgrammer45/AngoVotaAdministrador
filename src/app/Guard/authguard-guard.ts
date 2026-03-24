import { CanActivateFn, Router } from '@angular/router';
import { SessaoService } from '../Sessao-service/sessao.service';
import { inject } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';

export const authguardGuard: CanActivateFn = (route, state) => {

  const serviceSessao = inject(SessaoService);
  const rota = inject(Router);

  return serviceSessao.SessaoVerificar().pipe(
    tap(res=>{
      if (res.autenticado) {
        console.log('Sessão Válida!');
        return true;
      }else{
        console.warn('Sessão inválida');
        rota.navigate(['/HeaderBi']);
        return false;
      }
    }),

  map(res=> res.autenticado),
  catchError(err=>{
    console.log('Erro ao verificar');
    rota.navigate(['/HeaderBi']);
    return of(false)

   })
  )



  
  
 
}


