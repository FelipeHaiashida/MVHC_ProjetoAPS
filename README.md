# Museu Virtual da História da Computação (MVHC)

Aplicação web interativa desenvolvida como projeto acadêmico para a disciplina de **Análise e Projeto de Sistemas (2026.1)**. O MVHC é um museu virtual imersivo em 3D acessível diretamente pelo navegador, sem necessidade de instalação de software.

## Sobre o Projeto

O MVHC combina uma interface web moderna com um ambiente 3D desenvolvido em Unity (exportado via WebGL) para apresentar artefatos históricos da computação de forma interativa — como o ENIAC, Apple II e microprocessadores clássicos.

A autenticação de usuários é gerenciada pelo Firebase Auth, garantindo acesso controlado ao museu.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Ambiente 3D | Unity 3D + WebGL |
| Scripting | C# |
| Frontend | HTML5, CSS3, JavaScript (ES6 Modules) |
| Autenticação | Firebase Authentication |
| Analytics | Firebase Analytics |
| Hospedagem | GitHub Pages |
| Fontes | Google Fonts (Orbitron + DM Sans) |

## Funcionalidades

- Login e cadastro de usuários com e-mail/senha
- Recuperação de senha por e-mail
- Site de apresentação com animação de partículas no hero
- Seções: Sobre, Justificativa, Objetivos, Tecnologias, Funcionalidades, Desafios e Cronograma
- Navegação suave entre seções com scroll reveal
- Layout responsivo (desktop, tablet e mobile)
- Integração com build WebGL do Unity para o museu 3D

## Funcionalidades do Museu 3D (Unity)

- Navegação em primeira/terceira pessoa pelo ambiente 3D
- Interação com artefatos históricos (animações ao clicar)
- Painéis informativos com dados históricos
- Renderização nativa no navegador sem instalação

## Estrutura do Projeto

```
MVHC_ProjetoAPS/
├── index.html      # Portal principal (login + site de apresentação)
├── script.js       # Lógica JavaScript (Firebase Auth + interatividade)
└── style.css       # Estilos (tema escuro, animações, responsividade)
```

## Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/FelipeHaiashida/MVHC_ProjetoAPS.git
   ```

2. Abra o arquivo `index.html` em um servidor local (necessário para os módulos ES6 do Firebase):
   ```bash
   # Usando Python
   python -m http.server 8080

   # Usando Node.js (npx)
   npx serve .
   ```

3. Acesse `http://localhost:8080` no navegador.

> O projeto também está disponível via **GitHub Pages**.

## Configuração do Firebase

O projeto utiliza Firebase para autenticação. As credenciais estão configuradas em `script.js`. Para usar seu próprio projeto Firebase:

1. Crie um projeto em [Firebase Console](https://console.firebase.google.com)
2. Ative o **Authentication** com provedor de E-mail/Senha
3. Substitua o objeto `firebaseConfig` em `script.js` com suas credenciais

## Fases do Projeto

| Fase | Descrição |
|------|-----------|
| 1 | Levantamento de requisitos e planejamento |
| 2 | Desenvolvimento do ambiente 3D (Unity) |
| 3 | Integração WebGL + frontend web |
| 4 | Testes, ajustes e deploy |

## Equipe

Projeto desenvolvido por estudantes do curso de Análise e Projeto de Sistemas — 2026.1.

## Licença

Projeto acadêmico. Todos os direitos reservados aos autores.
