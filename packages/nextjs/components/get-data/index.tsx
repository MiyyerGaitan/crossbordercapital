import { useState } from "react";
import {
    Card,
    Input,
    Button,
    Typography
  } from "@material-tailwind/react";

/**
 * Display (ETH & USD) value for the input value provided.
 */
export const GetData = (props:any) => {
  const [otp, setOtp] = useState('');
  
  const handleChange = (e:any) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
        if(otp !== '') {
            props.getContract(e, otp);
        } else {
            alert('Por favor ingrese el Otp');
        }
      } catch (error) {
        console.error('Error al consultar datos en Firestore:', error);
      }
  };

    return (
        <div className="animate-pulse flex space-x-4 justify-center text-black">
         <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                Datos del giro
            </Typography>
            
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                <Typography color="gray" className="mt-1 font-normal">
                    Moneda Destino
                </Typography>
                
                <Input
                    size="lg"
                    placeholder="Ingrese el otp"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    name="otp"
                    onChange={handleChange}
                    value={otp}
                />
                
                <Button className="mt-6" onClick={handleSubmit}>
                    Enviar 
                </Button>
                <Button className="mt-6" onClick={props.handleOpen2} >
                    Cancelar 
                </Button>
            </form>
            </Card>
      </div>
    );

};

