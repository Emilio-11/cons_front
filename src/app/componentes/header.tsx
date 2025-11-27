import Image from "next/image";
import Link from "next/link";
import "./estilos/header.css";

export default function Header(){
    return(
        <header>
            <Link href="https://www.unam.mx/" className="center">
                <Image
                    className="logo"
                    src="/logo_fes.png"
                    alt="Logo FES"
                    width={200}
                    height={50}
                />
            </Link>
            <div className="yellowPart"></div>
            <div className="cedetecContainer">
                
            </div>
        </header>
    )
}