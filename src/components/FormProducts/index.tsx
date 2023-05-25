import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Modal, Button, Col, Form } from "react-bootstrap";
import { getData, save } from "../../service";
import { TextError } from "./styles";

interface Iprops {
    id: string
    nome: string
    nomeCategoria: string
    valor: string
}

interface Categories {
    id: string
    nome: string
}

interface IFormProps {
    show: boolean
    props: Iprops
    handleClose: () => void
}

export default function FormProducts({
    show,
    props,
    handleClose
}: IFormProps) {
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<Iprops>();

    const [categories, setCategories] = useState<Categories[]>([]);

    useEffect(() => {
        setValue("id", props?.id);
        setValue("nome", props?.nome);
        setValue("nomeCategoria", props?.nomeCategoria);
        setValue("valor", props?.valor);

        getData("categories").then((result) => setCategories(result));
    }, [props, setValue]);

    const onSubmit = (data: Iprops) => {
        save("products", data)
            .then((res) => {
                if (res?.status) {
                    Swal.fire(
                        "Sucesso!",
                        res?.message,
                        "success"
                    ).then((res) => {
                        if (res.isConfirmed) window.location.reload();
                    });
                } else {
                    Swal.fire(
                        "Erro!",
                        res?.message,
                        "error"
                    ).then((res) => {
                        if (res.isConfirmed) window.location.reload();
                    });
                }
            });
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Cadastrar produto</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body style={{
                    display: "flex",
                    gap: "16px"
                }}>
                    <Col>
                        <Form.Group controlId="id">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                defaultValue={props?.id}
                                {...register("id")}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="product">
                            <Form.Label>Produto</Form.Label>
                            <Form.Control
                                defaultValue={props?.nome}
                                placeholder="Digite o nome do produto"
                                {...register("nome", { required: true, minLength: 3, maxLength: 50 })}
                            />
                            {errors?.nome?.type === "required" && (
                                <TextError>Nome do produto é obrigatório</TextError>
                            )}
                            {errors?.nome?.type === "minLength" && (
                                <TextError>Digite 3 ou mais caracteres</TextError>
                            )}
                            {errors?.nome?.type === "maxLength" && (
                                <TextError>Digite no maximo 50 caracteres</TextError>
                            )}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="categorie">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select
                                style={{ cursor: "pointer" }}
                                placeholder="Digite o nome da categoria"
                                {...register("nomeCategoria", { required: true, minLength: 3 })}
                            >
                                <option value=""></option>
                                {categories.map((categorie) => {
                                    return <option key={categorie?.id} value={categorie?.nome} selected={categorie?.id === props.id}>{categorie?.nome}</option>;
                                })}
                            </Form.Select>
                            {errors?.nomeCategoria?.type === "required" && (
                                <TextError>Categoria é obrigatório</TextError>
                            )}
                            {errors?.nomeCategoria?.type === "minLength" && (
                                <TextError>Digite 3 ou mais caracteres</TextError>
                            )}
                        </Form.Group>
                        <Form.Group controlId="value">
                            <Form.Label>Valor</Form.Label>
                            <Form.Control
                                defaultValue={props?.valor}
                                placeholder="Digite o valor do produto"
                                type="number"
                                {...register("valor", { required: true, min: 0, max: 10000000 })}
                            />
                            {errors?.valor?.type === "required" && (
                                <TextError>Valor é obrigatório</TextError>
                            )}
                            {errors?.valor?.type === "min" && (
                                <TextError>Digite um valor maior que 0</TextError>
                            )}
                            {errors?.valor?.type === "max" && (
                                <TextError>Digite um valor menor que 10.000.000</TextError>
                            )}
                        </Form.Group>
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" type="button" onClick={() => handleClose()}>
                        Cancelar
                    </Button>
                    <Button variant="success" type="submit">Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};