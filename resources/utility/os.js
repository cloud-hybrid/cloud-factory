import OS from "os";
export const E2BIG = OS.constants.errno["E2BIG"];
export const EACCES = OS.constants.errno["EACCES"];
export const EADDRINUSE = OS.constants.errno["EADDRINUSE"];
export const EADDRNOTAVAIL = OS.constants.errno["EADDRNOTAVAIL"];
export const EAFNOSUPPORT = OS.constants.errno["EAFNOSUPPORT"];
export const EAGAIN = OS.constants.errno["EAGAIN"];
export const EALREADY = OS.constants.errno["EALREADY"];
export const EBADF = OS.constants.errno["EBADF"];
export const EBADMSG = OS.constants.errno["EBADMSG"];
export const EBUSY = OS.constants.errno["EBUSY"];
export const ECANCELED = OS.constants.errno["ECANCELED"];
export const ECHILD = OS.constants.errno["ECHILD"];
export const ECONNABORTED = OS.constants.errno["ECONNABORTED"];
export const ECONNREFUSED = OS.constants.errno["ECONNREFUSED"];
export const ECONNRESET = OS.constants.errno["ECONNRESET"];
export const EDEADLK = OS.constants.errno["EDEADLK"];
export const EDESTADDRREQ = OS.constants.errno["EDESTADDRREQ"];
export const EDOM = OS.constants.errno["EDOM"];
export const EDQUOT = OS.constants.errno["EDQUOT"];
export const EEXIST = OS.constants.errno["EEXIST"];
export const EFAULT = OS.constants.errno["EFAULT"];
export const EFBIG = OS.constants.errno["EFBIG"];
export const EHOSTUNREACH = OS.constants.errno["EHOSTUNREACH"];
export const EIDRM = OS.constants.errno["EIDRM"];
export const EILSEQ = OS.constants.errno["EILSEQ"];
export const EINPROGRESS = OS.constants.errno["EINPROGRESS"];
export const EINTR = OS.constants.errno["EINTR"];
export const EINVAL = OS.constants.errno["EINVAL"];
export const EIO = OS.constants.errno["EIO"];
export const EISCONN = OS.constants.errno["EISCONN"];
export const EISDIR = OS.constants.errno["EISDIR"];
export const ELOOP = OS.constants.errno["ELOOP"];
export const EMFILE = OS.constants.errno["EMFILE"];
export const EMLINK = OS.constants.errno["EMLINK"];
export const EMSGSIZE = OS.constants.errno["EMSGSIZE"];
export const EMULTIHOP = OS.constants.errno["EMULTIHOP"];
export const ENAMETOOLONG = OS.constants.errno["ENAMETOOLONG"];
export const ENETDOWN = OS.constants.errno["ENETDOWN"];
export const ENETRESET = OS.constants.errno["ENETRESET"];
export const ENETUNREACH = OS.constants.errno["ENETUNREACH"];
export const ENFILE = OS.constants.errno["ENFILE"];
export const ENOBUFS = OS.constants.errno["ENOBUFS"];
export const ENODATA = OS.constants.errno["ENODATA"];
export const ENODEV = OS.constants.errno["ENODEV"];
export const ENOENT = OS.constants.errno["ENOENT"];
export const ENOEXEC = OS.constants.errno["ENOEXEC"];
export const ENOLCK = OS.constants.errno["ENOLCK"];
export const ENOLINK = OS.constants.errno["ENOLINK"];
export const ENOMEM = OS.constants.errno["ENOMEM"];
export const ENOMSG = OS.constants.errno["ENOMSG"];
export const ENOPROTOOPT = OS.constants.errno["ENOPROTOOPT"];
export const ENOSPC = OS.constants.errno["ENOSPC"];
export const ENOSR = OS.constants.errno["ENOSR"];
export const ENOSTR = OS.constants.errno["ENOSTR"];
export const ENOSYS = OS.constants.errno["ENOSYS"];
export const ENOTCONN = OS.constants.errno["ENOTCONN"];
export const ENOTDIR = OS.constants.errno["ENOTDIR"];
export const ENOTEMPTY = OS.constants.errno["ENOTEMPTY"];
export const ENOTSOCK = OS.constants.errno["ENOTSOCK"];
export const ENOTSUP = OS.constants.errno["ENOTSUP"];
export const ENOTTY = OS.constants.errno["ENOTTY"];
export const ENXIO = OS.constants.errno["ENXIO"];
export const EOPNOTSUPP = OS.constants.errno["EOPNOTSUPP"];
export const EOVERFLOW = OS.constants.errno["EOVERFLOW"];
export const EPERM = OS.constants.errno["EPERM"];
export const EPIPE = OS.constants.errno["EPIPE"];
export const EPROTO = OS.constants.errno["EPROTO"];
export const EPROTONOSUPPORT = OS.constants.errno["EPROTONOSUPPORT"];
export const EPROTOTYPE = OS.constants.errno["EPROTOTYPE"];
export const ERANGE = OS.constants.errno["ERANGE"];
export const EROFS = OS.constants.errno["EROFS"];
export const ESPIPE = OS.constants.errno["ESPIPE"];
export const ESRCH = OS.constants.errno["ESRCH"];
export const ESTALE = OS.constants.errno["ESTALE"];
export const ETIME = OS.constants.errno["ETIME"];
export const ETIMEDOUT = OS.constants.errno["ETIMEDOUT"];
export const ETXTBSY = OS.constants.errno["ETXTBSY"];
export const EWOULDBLOCK = OS.constants.errno["EWOULDBLOCK"];
export const EXDEV = OS.constants.errno["EXDEV"];
const Signals = {
    E2BIG,
    EACCES,
    EADDRINUSE,
    EADDRNOTAVAIL,
    EAFNOSUPPORT,
    EAGAIN,
    EALREADY,
    EBADF,
    EBADMSG,
    EBUSY,
    ECANCELED,
    ECHILD,
    ECONNABORTED,
    ECONNREFUSED,
    ECONNRESET,
    EDEADLK,
    EDESTADDRREQ,
    EDOM,
    EDQUOT,
    EEXIST,
    EFAULT,
    EFBIG,
    EHOSTUNREACH,
    EIDRM,
    EILSEQ,
    EINPROGRESS,
    EINTR,
    EINVAL,
    EIO,
    EISCONN,
    EISDIR,
    ELOOP,
    EMFILE,
    EMLINK,
    EMSGSIZE,
    EMULTIHOP,
    ENAMETOOLONG,
    ENETDOWN,
    ENETRESET,
    ENETUNREACH,
    ENFILE,
    ENOBUFS,
    ENODATA,
    ENODEV,
    ENOENT,
    ENOEXEC,
    ENOLCK,
    ENOLINK,
    ENOMEM,
    ENOMSG,
    ENOPROTOOPT,
    ENOSPC,
    ENOSR,
    ENOSTR,
    ENOSYS,
    ENOTCONN,
    ENOTDIR,
    ENOTEMPTY,
    ENOTSOCK,
    ENOTSUP,
    ENOTTY,
    ENXIO,
    EOPNOTSUPP,
    EOVERFLOW,
    EPERM,
    EPIPE,
    EPROTO,
    EPROTONOSUPPORT,
    EPROTOTYPE,
    ERANGE,
    EROFS,
    ESPIPE,
    ESRCH,
    ESTALE,
    ETIME,
    ETIMEDOUT,
    ETXTBSY,
    EWOULDBLOCK,
    EXDEV
};
export { Signals };
//# sourceMappingURL=os.js.map