# 🚩CrossBorder Capital
### Invierte local, conecta global, tu moneda, tu comunidad, nuestro mundo.

![readme-1]![banner](https://github.com/MiyyerGaitan/crossbordercapital/assets/7397155/1b8c70d4-fd89-4424-ae9c-dd77178dac7a)

🦸  El proceso de transferencia de activos: El proceso de transferencia de activos comienza cuando un cliente llega a tu casa de cambio. Este te pide el monto que quiere transferir. Con esta información, ingresas el monto en el sistema y este te indica la tarifa a cobrar según la tasa de cambio.

Cliente entregando activos a un cajero de una casa de cambio Luego, le solicitas al cliente su información de contacto para crearlo en el sistema. El sistema le envía un código para el retiro de sus activos en el país destino. Por ese motivo, es importante registrar los datos del cliente destino para que pueda retirar su dinero. Image of Cajero de una casa de cambio ingresando información en el sistemaSe abre en una ventana nueva Cajero de una casa de cambio ingresando información en el sistema

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

## Descripción de flujo:

El usuario vendedor debe iniciar la orden, por lo que se realiza la solicitud creando una orden y dejando que el facilitador pueda aceptar la orden y comprar los fondos del vendedor en ETH, se verifica que el vendedor cumpla con los fondos. El facilitador recibe una notificación para transferir lo equivalentea los fondos del vendedor 

## Verificación de facilitadores:
- Para que una persona se convierta en verificador debe hacer un staking de un monto mínimo de ETH en metapool, recibiendo mpETH y generando el rendimiento que ofrecen. 
- El contrato verifica a los facilitadores y los autoriza a realizar transacciones una vez valida la disponibilidad de fondos en su wallet.

## Orden de envío de activos:
- Primero se debe ingresar los fondos mediante el botón Enviar activos y posteriormente se llena el formulario.
- Mediante un formulario se registran los datos de la persona que envía y recibe y el sistema genera un OTP que es envíado a la persona que recibirá el activo.
- Se genera una llamada a la función para envío de activos, el facilitador transfiere ETH al contrato y este se queda en él mientras que se completa la transacción.
- Cuando la persona al otro lado reclama el activo con su OTP, el facilitador que entrega hace una llamada a la función de completar transacción, lo que libera el ETH del contrato, restando la comisión que se cobra.

## Comisión y rewards
- Se cobra una comisión del 2% por transacción, la cual se distribuye (40 % facilitadores, 40% Protocolo y 20% Comunidad)
- La comisión se cobra y se convierte a mpETH mediante la función de stakeETH para generar rendimiento.
- Cuando se cumple un trheshold de comisiones se activa la función para distribnuir las comisiones en mpETH
- EL protocolo puede retirar los fondos en staking mediante la función de withdraw

## Integración de Metapool:

La integración con Metapool tuvo importantes dificultades pues la documentación era muy escasa, no habian ejemplos, no hubo una persona de apoyo, ningún mentor conocia la tecnología y no hubo respuesta en los canales de discord o telegram sino hasta el domingo en la tarde. En dicho momento habiamos cambiado de enfoque, sin embargo se decidió subir un contrato alterno Cbc.sol en el cual se intentó integrar dicha tecnología con el poco tiempo restante.

Integramos metapool utilizando el contrato Cbc, en la carpeta integración metapool para hacer staking de activos, pagar rewards, verificar a los facilitadores de la red y retirar fondos del proyecto, mediante mpETH en la testnet goerli. También puede ser desplegado en Aurora testnet cambiando las direcciones de los contratos correspondientes de metapool a la nueva red.

