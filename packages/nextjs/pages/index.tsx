import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 w-[90%] md:w-[75%]">
          <h1 className="text-center mb-6">
            <span className="block text-4xl mb-2">CrossBorder Capital</span>
            <span className="block text-2xl font-bold">Invierte local, conecta global, tu moneda, tu comunidad, nuestro mundo.</span>
          </h1>
          <div className="flex flex-col items-center justify-center">
            <video id="videoPlayer" width="640" height="360" controls>
              <source src="video1.mp4" type="video/mp4" />
              Tu navegador no soporta la etiqueta de video.
            </video>
            <div className="max-w-3xl">
              <p className="text-center text-lg mt-8">
                🦸 El proceso de transferencia de dinero: 
                El proceso de transferencia de dinero comienza cuando un cliente llega a tu casa de cambio. Este te da en su moneda local el monto que quiere transferir. Con esta información, ingresas el monto en el sistema y este te indica la tarifa a cobrar según la tasa de cambio. 
                <br /><br />
                <img alt="dinero" src="/dinero.png" />	
                <br />
                Cliente entregando dinero a un cajero de una casa de cambio
                Luego, le solicitas al cliente su información de contacto para crearlo en el sistema. El sistema le envía un código para el retiro de su dinero en el país destino. Por ese motivo, es importante registrar los datos del cliente destino para que pueda retirar su dinero.
                Image of Cajero de una casa de cambio ingresando información en el sistemaSe abre en una ventana nueva
                
                Cajero de una casa de cambio ingresando información en el sistema
                <br /><br />
                <img alt="dinero" src="/dinero2.jpg" />	
                <br />
                El cliente recibe el código y se acerca a la casa de cambio destino y retira su dinero. Le entrega el código, el cajero lo ingresa en el sistema y le entrega el dinero en su moneda local.
              </p>
              <br />
              <img alt="dinero" src="/dinero3.jpg" />
              <br /><br />
              <p className="text-center text-lg">
                🌟 Una vez finalizada la transferencia de dinero, las partes involucradas reciben su porcentaje de ganancia según el acuerdo establecido.
                <br />
                La comunidad de inversores recibe su porcentaje de ganancia, que se calcula en función de la cantidad de dinero transferido y de la tasa de cambio aplicable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
