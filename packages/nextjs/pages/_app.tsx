import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
 

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  const [init, setInit] = useState(false);
  const [esDispositivoMovil, setEsDispositivoMovil] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }

    const verificarTamañoVentana = () => {
      setEsDispositivoMovil(window.innerWidth <= 768);
    };

    verificarTamañoVentana();

    // Agregar un listener para manejar cambios en el tamaño de la ventana
    window.addEventListener('resize', verificarTamañoVentana);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', verificarTamañoVentana);
    };

  }, [setNativeCurrencyPrice, price]);

  const handleOpen = () => setOpen(!open);

  const login = () => {
    setInit(true);
  }
  return (
    <>
      {init &&
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="relative flex flex-col flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      }
      {!init && 
        <div style={{ backgroundColor: '#fff9f3', textAlign: 'center' }}>
          {/* Banner en la parte superior */}
          <div>
            {esDispositivoMovil && <img src="/banner2.png" alt="CrossBorder Capital"  style={{ width: '100%'}} />}
            {!esDispositivoMovil && <img src="/banner.png" alt="CrossBorder Capital"  style={{ width: '100%'}} />}
          </div>

          {/* Botones de Login y Crear Cuenta */}
          <div style={{ textAlign: 'center', position: 'absolute', display: 'flex', bottom: '20px', justifyContent:'center', width:'100%' }}>
            <button className="button-49" style={{marginRight: "50px"}} onClick={() => {login(); }}>Entrar</button>
            <button className="button-49" onClick={handleOpen} >Inscribirme</button>
          </div>
            
            {/* Modal de Login */}
            <Dialog open={open} handler={handleOpen} className="bg-black">
              <DialogHeader>¿Cómo funciona?</DialogHeader>
              <DialogBody>
                <p>CrossBorder Capital es una nueva plataforma que hace que las transferencias de dinero internacionales sean más accesibles y asequibles para todos.</p>
                <p>Con CrossBorder Capital puedes hacer parte de la comunidad de inversores que invierten de manera colectiva para formar casas de cambio.</p>
                <p>Esto permite un sistema más eficiente para transferir fondos entre países, reduciendo los costos asociados.</p>
                <DialogHeader>Para poder participar en la comunidad debes:</DialogHeader>
                <ul>
                  <li>1. Ser mayor de edad</li>
                  <li>2. Tener una cuenta de Metamask</li>
                  <li>3. Tener una wallet con minimo 0.2 ETH</li>
                </ul>
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
                >
                  <span>Cerrar</span>
                </Button>
                <Button variant="gradient" color="green" onClick={login}>
                  <span>Participar</span>
                </Button>
              </DialogFooter>
            </Dialog>
          
        </div>
        }
      <Toaster />
      
    </>
  );
};

const ScaffoldEthAppWithProviders = (props: AppProps) => {
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();
  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <NextNProgress />
      <RainbowKitProvider
        chains={appChains.chains}
        avatar={BlockieAvatar}
        theme={isDarkTheme ? darkTheme() : lightTheme()}
      >
        <ScaffoldEthApp {...props} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default ScaffoldEthAppWithProviders;
