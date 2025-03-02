const Validation = {
    validation: async (schema, datas) => {
        return schema.parse(datas);
    }
}

export default Validation;