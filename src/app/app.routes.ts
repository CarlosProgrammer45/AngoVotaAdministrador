import { RelatorioGrafico } from './relatorio-grafico/relatorio-grafico';
import { Relatorio } from './relatorio/relatorio';
import { Estatistica } from './estatistica/estatistica';
import { Eleitores } from './eleitores/eleitores';
import { DetalhamentoProvincial2 } from './detalhamento-provincial2/detalhamento-provincial2';
import { DetalhamentoProvincial } from './detalhamento-provincial/detalhamento-provincial';
import { ConsolidacaoNacional } from './consolidacao-nacional/consolidacao-nacional';
import { Candidato } from './candidato/candidato';
import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Cnebi } from './Comunicacao-com-backend/cne/cnebi';
import { Reconhecer } from './reconhecimento-facial/reconhecer/reconhecer';
import { HeaderBi } from './Comunicacao-com-backend/header-bi/header-bi';
import { BiometriaCadastro } from './WebAuthn/biometria-cadastro/biometria-cadastro';
import { Login } from './WebAuthn/biometria-login/login/login';
import { CriarBilhetes } from './cne-atctivits/criar-bilhetes/criar-bilhetes';
import { EspecificacaoProvincial } from './especificacao-provincial/especificacao-provincial';
import { PaginaPrincipal } from './Componente-pagina-inicial/pagina-principal/pagina-principal';
import { CriaPerfilCne } from './cne-atctivits/criar-perfil-cne/criar-perfil-cne';
import { Resultados } from './resultados/resultados';
import { CriarCandidato } from './cne-atctivits/criar-candidato/criar-candidato';







export const routes: Routes = [
    {
        path:'', component: PaginaPrincipal
    },

    {
        path:'HeaderBi', component: HeaderBi
    },

    {
     path:"dashboard",component:Dashboard 
    },
    {
     path:"eleitores",component:Eleitores
    },
    {
     path:"candidato",component:Candidato
    },
        {
     path:"relatorio", component:Relatorio
    },

    
     {
     path:"consolidacaonacional", component: ConsolidacaoNacional
    },

    

     {
     path:"detalhamentoprovincial",component:DetalhamentoProvincial
    },
      {
     path:"detalhamentoprovincial2",component:DetalhamentoProvincial2
    },

      {
     path:"estatistica",component:Estatistica
    },
  
    {
     path:"relatoriografico",component:RelatorioGrafico
    },

    {
        path:"Cnebi", component:Cnebi
    },

    {
        path:'cadastrowebauth', component: BiometriaCadastro
    },

    {
        path: 'loginwebauth', component: Login
    },

    {
        path: 'novoBilhete', component: CriarBilhetes
    },  

    {
        path: 'especificacao', component: EspecificacaoProvincial
    },

    {
        path: 'principal', component: PaginaPrincipal
    },

    {
        path:"reconhecimento", component: Reconhecer
    }, 

    {
        path:'perfilRapido', component: CriaPerfilCne
    },

    {
        path:'resultados', component: Resultados
    },

     {
        path:'criarCandidatos', component: CriarCandidato
    },
    
    {
        path:'', redirectTo:"principal", pathMatch:"full"
    },

 

    
     
];
