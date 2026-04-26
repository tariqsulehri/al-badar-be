import { object, string } from "yup";

const schema = object().shape({
    username: string().required().min(4),
    password: string().required().min(4),
});

export default schema;
