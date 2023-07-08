import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { errorHandler, httpRequester } from "service";
import { saveFn, getCategories } from "controller";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import * as M from "components/Modal";
import { TextError } from "./styles";
import { ICategories, FormCategories } from "interface";

export default function Categories({ show, props, handleClose }: FormCategories) {
    var categories = localStorage.getItem("categories");
    const [buscador, setBuscador] = useState<boolean>(false);

    if (categories !== null) {
        categories = JSON.parse(categories)
    } else if (!buscador) {
        setBuscador(true)
    };

    const { id, nomeCategoria } = props;

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<ICategories>();

    useEffect(() => {
        setValue("id", id);
        setValue("nomeCategoria", nomeCategoria);
    }, [props, setValue]);

    useEffect(() => {
        if (buscador) {
            httpRequester(getCategories).then((res) => {
                localStorage.setItem("categories", JSON.stringify(res));
            });
        }
        setBuscador(false);
    }, [buscador]);

    const onSubmit = (data: ICategories) => {
        saveFn("/categorias", data);
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
        >
            <M.Header title="Cadastrar categoria" />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <M.Body>
                    <Form.Group controlId="id">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            defaultValue={id}
                            {...register("id")}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group controlId="categorie">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                            defaultValue={nomeCategoria}
                            placeholder="Digite o nome da categoria"
                            {...register("nomeCategoria", {
                                required: true,
                                minLength: 3,
                                maxLength: 50,
                            })}
                        />
                        {errors?.nomeCategoria && (
                            <TextError>
                                {errorHandler(errors?.nomeCategoria?.type, { field: "Categoria", minLength: 3, maxLength: 50 })}
                            </TextError>
                        )}
                    </Form.Group>
                </M.Body>
                <M.Footer onClick={handleClose} />
            </Form>
        </Modal>
    );
};
