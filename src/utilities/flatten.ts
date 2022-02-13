/***
 *
 * @param obj {object}
 *
 * @returns {{}}
 *
 */

const Flatten = (obj: any) => {
    const _: any = {};

    Object.keys( obj ).forEach( (key) => {
        _[ key ] = typeof obj[ key ];

        if ( key === "0" ) {
            delete _[ key ];
            delete obj[ key ];

            _[ "$" ] = "list";
        } else {
            if ( typeof obj[ key ] === "object" && obj[ key ] !== null ) {
                _[ key ] = Flatten( obj[ key ] );
            } else {
                ( obj[ key ] === null ) ? _[ key ] = null : _[ key ] = typeof obj[ key ];
            }
        }

    } );

    return _;
};

export { Flatten };

export default Flatten;
