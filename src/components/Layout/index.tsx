import Footer from "../Footer";
import Header from "../Header";
import { Container } from "./atoms";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <Container>
            <Header />
            <Outlet />
            <Footer />
        </Container>
    );
};