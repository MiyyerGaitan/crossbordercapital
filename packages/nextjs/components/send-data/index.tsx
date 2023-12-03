import { useState } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
    Select,
    Option
  } from "@material-tailwind/react";
  import { db } from '../../firebase';
  import {
	collection,
	onSnapshot,
	query,
	getDocs,
	doc,
	getDoc,
	updateDoc,
	orderBy,
	Timestamp,
	runTransaction,
	where,
	addDoc,
} from "firebase/firestore";

/**
 * Display (ETH & USD) value for the input value provided.
 */
export const SendData = (props:any) => {
  const [remitente, setRemitente] = useState({ nombre: '', cedula: '', email: '' });
  const [receptor, setReceptor] = useState({ nombre: '', cedula: '', email: '' });
  const [monto, setMonto] = useState(0);
  const [montoPagar, setMontoPagar] = useState(0);
  const [montoConvertido, setMontoConvertido] = useState(null);
  const [monedaSeleccionadaOrigen, setMonedaSeleccionadaOrigen] = useState('COP'); // Valor inicial
  const [monedaSeleccionadaDestino, setMonedaSeleccionadaDestino] = useState('USD'); // Valor inicial

  const handleChange = (e:any, tipo:string) => {
    if(tipo === 'destino') {
        setMonedaSeleccionadaDestino(e.target.value);
    } else {
        setMonedaSeleccionadaOrigen(e.target.value);
    }
  };

  const handleRemitenteChange = (e:any) => {
    setRemitente({ ...remitente, [e.target.name]: e.target.value });
  };

  const handleReceptorChange = (e:any) => {
    setReceptor({ ...receptor, [e.target.name]: e.target.value });
  };
  const handleMontoChange = (e:any) => {
    setMonto(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    // Aquí podrías guardar los datos en Firebase Firestore o realizar cualquier otra acción necesaria
    console.log('Datos del remitente:', remitente);
    console.log('Datos del receptor:', receptor);

    try {
        if(remitente.nombre !== '' && remitente.cedula !== '' && remitente.email !== '' &&
        receptor.nombre !== '' && receptor.cedula !== '' && receptor.email !== '' &&
        montoConvertido !== null && montoPagar !== 0) {
        const datosGiro = {remitente, receptor}
        const someCol = collection(db, "giros");
        const girosRef = await addDoc(someCol, datosGiro);
        console.log('ID de la transacion guardado:', girosRef.id);
        props.executeContract(e, girosRef.id,montoPagar,montoConvertido);
        } else {
            alert('Por favor ingrese todos los datos');
        }
      } catch (error) {
        console.error('Error al guardar datos en Firestore:', error);
      }
  };

  const handleConvertir = async () => {
    try {
        //https://app.exchangerate-api.com/keys
      const response = await fetch('https://v6.exchangerate-api.com/v6/f629b51c238bcb4981dd3e21/latest/' + monedaSeleccionadaOrigen);
      const dataExchan = await response.json();
      console.log('dataExchan:', dataExchan);     
      const tasaDeCambioNum = dataExchan.conversion_rates[monedaSeleccionadaDestino] // Cambiar 'EUR' según tus necesidades
      console.log('dataExchan:', tasaDeCambioNum);
      const montoOriginalNum = parseFloat(monto.toString());
      setMontoPagar(montoOriginalNum * 5 /100 + montoOriginalNum);

      if (!isNaN(montoOriginalNum) && !isNaN(tasaDeCambioNum)) {
        const resultado:any = montoOriginalNum * tasaDeCambioNum;
        setMontoConvertido(resultado.toFixed(2)); // Redondear a dos decimales
      } else {
        setMontoConvertido(null);
      }
    } catch (error) {
      console.error('Error al obtener la tasa de cambio:', error);
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
                <div className="flex w-72 flex-col gap-6">
                    <select name="monedaSeleccionadaOrigen" value={monedaSeleccionadaOrigen} onChange={(e) => handleChange(e, 'origen')}>
                        <option value='USD'>USD</option>
                        <option value='EUR'>EUR</option>
                        <option value='VES'>VES</option>
                        <option value='COP'>COP</option>
                    </select>
                </div>
                <Typography color="gray" className="mt-1 font-normal">
                    Moneda destino
                </Typography>
                <div className="flex w-72 flex-col gap-6">
                    <select name="monedaSeleccionadaDestino" value={monedaSeleccionadaDestino} onChange={(e) => handleChange(e, 'destino')}>
                        <option value='USD'>USD</option>
                        <option value='EUR'>EUR</option>
                        <option value='VES'>VES</option>
                        <option value='COP'>COP</option>
                    </select>
                </div>
                <Typography color="gray" className="mt-1 font-normal">
                    Monto
                </Typography>
                <Input
                    size="lg"
                    placeholder="Ingrese el monto"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    type="int"
                    name="monto"
                    onChange={handleMontoChange}
                    value={monto}
                />
                <br />
                <Button className="mt-6" onClick={handleConvertir}>Convertir</Button>
                <br />
                {montoConvertido !== null && (
                    <>
                        <br/>
                        <Typography variant="h4" color="blue-gray">
                            Monto Convertido: {montoConvertido} a {monedaSeleccionadaDestino}
                        </Typography>
                        
                        <Typography variant="h4" className="mt-1 font-normal text-green-500">
                            Monto a pagar
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="Monto a pagar"
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                            className: "before:content-none after:content-none",
                            }}
                            type="int"
                            name="montoPagar"
                            value={montoPagar}
                            disabled
                        />
                    </>
                )}
                <Typography color="gray" className="mt-1 font-normal">
                    Ingresa los datos del usuario que envía el giro
                </Typography>

                <div className="mb-1 flex flex-col gap-6 envia">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Nombre
                </Typography>
                <Input
                    size="lg"
                    placeholder="Pepe"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    name="nombre"
                    onChange={handleRemitenteChange}
                    value={remitente.nombre}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Email
                </Typography>
                <Input
                    size="lg"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    type="email"
                    name="email"
                    onChange={handleRemitenteChange}
                    value={remitente.email}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Cedula
                </Typography>
                <Input
                    type="int"
                    size="lg"
                    placeholder="123456789"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    name="cedula"
                    onChange={handleRemitenteChange}
                    value={remitente.cedula}
                />
                </div>
                
                <Typography color="gray" className="mt-1 font-normal">
                    Ingresa los datos del usuario que recibe el giro
                </Typography>
                <div className="mb-1 flex flex-col gap-6 recibe">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Nombre
                </Typography>
                <Input
                    size="lg"
                    placeholder="Pepe"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    name="nombre"
                    onChange={handleReceptorChange}
                    value={receptor.nombre}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Email
                </Typography>
                <Input
                    size="lg"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    type="email"
                    name="email"
                    onChange={handleReceptorChange}
                    value={receptor.email}
                />
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                    Cedula
                </Typography>
                <Input
                    type="int"
                    size="lg"
                    placeholder="123456789"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                    className: "before:content-none after:content-none",
                    }}
                    name="cedula"
                    onChange={handleReceptorChange}
                    value={receptor.cedula}
                />
                </div>
                <Button className="mt-6" onClick={handleSubmit}>
                    Enviar 
                </Button>
                <Button className="mt-6" >
                    Cencelar 
                </Button>
            </form>
            </Card>
      </div>
    );

};

