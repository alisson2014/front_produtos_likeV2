import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { errorHandler, httpRequester } from "service";
import { getCategories, saveFn } from "controller";
import { ICategories } from "interface";
import Button from "react-bootstrap/Button";
import { AiOutlineClear } from "react-icons/ai";
import * as S from "./atoms";
import { Title } from "styles/basics";

export default function Register() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formProps, setFormProps] = useState<ICategories>({
        id: "",
        nomeCategoria: ""
    });

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<ICategories>();

    useEffect(() => {
        setValue("id", formProps.id);
        setValue("nomeCategoria", formProps.nomeCategoria);
    }, [formProps, setValue]);

    useEffect(() => {
        if (id === "cadastrar") {
            setFormProps({
                id: "",
                nomeCategoria: ""
            });
        }

        if (id !== undefined && id !== "cadastrar") {
            const idNumber = parseInt(id);
            httpRequester({ ...getCategories, id: idNumber })
                .then((res) => setFormProps(res));
        }
    }, []);

    const onSubmit = (data: ICategories) => {
        saveFn("categorias", data);
        navigate("/categorias/cadastrar");
    };

    return (
        <S.Forms onSubmit={handleSubmit(onSubmit)}>
            <Title>Cadastro de categorias</Title>
            <S.Group controlId="id">
                <S.Label>ID</S.Label>
                <S.Input
                    defaultValue={formProps.id}
                    {...register("id")}
                    readOnly
                />
            </S.Group>
            <S.Group controlId="categorie">
                <S.Label>Categoria</S.Label>
                <S.Input
                    className={errors?.nomeCategoria && "error"}
                    defaultValue={formProps.nomeCategoria}
                    {...register("nomeCategoria", {
                        required: true,
                        minLength: 3,
                        maxLength: 50,
                    })}
                    placeholder="Digite o nome da categoria"
                />
                {errors?.nomeCategoria && (
                    <S.Feedback>
                        {errorHandler(errors?.nomeCategoria?.type, { field: "Categoria", minLength: 3, maxLength: 50 })}
                    </S.Feedback>
                )}
            </S.Group>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="warning" type="reset" title="Limpar">
                    <AiOutlineClear />
                </Button>
                <Button variant="success" type="submit" title="Salvar">Salvar</Button>
            </div>
        </S.Forms>
    );
};