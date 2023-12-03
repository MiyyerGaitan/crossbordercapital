# 🚩CrossBorder Capital
### Invierte local, conecta global, tu moneda, tu comunidad, nuestro mundo.

![readme-1]![banner](https://github.com/MiyyerGaitan/crossbordercapital/assets/7397155/1b8c70d4-fd89-4424-ae9c-dd77178dac7a)

🦸  El proceso de transferencia de dinero: El proceso de transferencia de dinero comienza cuando un cliente llega a tu casa de cambio. Este te da en su moneda local el monto que quiere transferir. Con esta información, ingresas el monto en el sistema y este te indica la tarifa a cobrar según la tasa de cambio.

Cliente entregando dinero a un cajero de una casa de cambio Luego, le solicitas al cliente su información de contacto para crearlo en el sistema. El sistema le envía un código para el retiro de su dinero en el país destino. Por ese motivo, es importante registrar los datos del cliente destino para que pueda retirar su dinero. Image of Cajero de una casa de cambio ingresando información en el sistemaSe abre en una ventana nueva Cajero de una casa de cambio ingresando información en el sistema

El cliente recibe el código y se acerca a la casa de cambio destino y retira su dinero. Le entrega el código, el cajero lo ingresa en el sistema y le entrega el dinero en su moneda local.

---

## Paso 0: 📦 Ecosistema 📚

Antes de empezar, debe instalar las siguientes herramientas:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) o [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

A continuación, descarga el reto en tu ordenador e instala las dependencias ejecutando:

```sh
git clone https://github.com/MiyyerGaitan/crossbordercapital
crossbordercapital
cd crossbordercapital
git checkout crossbordercapital
yarn install
```

> en el mismo terminal, inicie su red local (un emulador de blockchain en su ordenador):

```sh
yarn chain
```

> en una segunda ventana de terminal, 🛰 despliega tu contrato (localmente):

```sh
cd crossbordercapital
yarn deploy
```

> en una tercera ventana de terminal, inicia tu frontend 📱.:

```sh
cd crossbordercapital
yarn start
```

📱 Abre http://localhost:3000 para ver la aplicación.

> 👩‍💻 Vuelve a ejecutar `yarn deploy` cada vez que quieras desplegar nuevos contratos en el frontend. Si no has hecho ningún cambio en el contrato, puedes ejecutar `yarn deploy --reset` para un despliegue completamente nuevo.

🔏 Ahora estás listo para editar tu contrato inteligente `Staker.sol` en `packages/hardhat/contracts`.

---

## Paso 1: 🥩 Inicio Stake 💵

El usuario vendedor debe iniciar la orden, por lo que se realiza la solicitud creando una orden y dejando que el facilitador pueda aceptar la orden y comprar los fondos del vendedor en ETH, se verifica que el vendedor cumpla con los fondos. El facilitador recibe una notificación para transferir lo equivalente en divisa local a las fondos del vendedor 



Integración de Metapool:

Integramos metapool utilizando el contrato CBC, en la carpeta integración metapool para hacer staking de activos, pagar rewards, verificar a los facilitadores de la red y retirar fondos del proyecto.
Hacemos uso de las librerias en interfaces que provee metapool para dicho propósito.
