import Process from "process";
import TTY from "tty";

const Device = TTY.isatty( Process.stdout.fd );

const Rows = () => ( Device ) ? Process.stdout.rows : null;
const Columns = () => ( Device ) ? Process.stdout.columns : null;

export { Device, Rows, Columns };

export default Device;