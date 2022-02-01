import Question, { Input, Selectable, Validation } from "./question";

const validation = ($: any) => {
    return (Validation.valid( $ )) ? new Promise( (resolve) => {
        setTimeout( async () => {
            const result = Validation.digit( $ );
            (result === true) && resolve( true );
            resolve( Validation.digit( $ ) );
        }, 2500 );
    } ) : Validation.message( "[Warning] Input Cannot be Empty" );
};

const Name = Input.initialize( "name", "Name", "Jacob" );
const Surname = Input.initialize( "surname", "Last-Name", "Sanders" );
const Age = Input.initialize( "age", "Age", null, validation );

const List = Selectable.initialize( "list", "Selection", [ "Test-1", "Test-2" ] );

const questions = [
    Name,
    Surname,
    Age,

    List
];

Question.prompt( questions ).then( (answers) => {
    console.log( JSON.stringify( answers, null, 4 ) );
} );

export {};