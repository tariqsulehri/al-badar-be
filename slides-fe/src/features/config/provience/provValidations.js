import { boolean, object, string } from "yup";

const schema = object().shape({
    name: string().required(),
    is_active: boolean().required(),
});

export default schema;
