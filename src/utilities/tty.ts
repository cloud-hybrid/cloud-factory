import Process from "process";

import $ from "tty";

const Device = $.isatty( Process.stdout.fd );

const TTY = Device;

const Rows = () => ( Device ) ? Process.stdout.rows : null;
const Columns = () => ( Device ) ? Process.stdout.columns : null;

export { TTY, Device, Rows, Columns };

export default Device;