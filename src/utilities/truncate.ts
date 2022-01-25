const Truncate = (input: string, integer: number): string => {
    if (input.length <= integer) return input;

    return input.slice(0, integer);
};

export { Truncate };

export default Truncate;