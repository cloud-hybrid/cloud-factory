import $ from "inquirer";
const characters = (value) => {
    if (!valid(value)) {
        return "[Warning] Input Value Required (String)";
    }
    else {
        if (new RegExp("^(\\w+)$", "g").exec(value) !== null) {
            return true;
        }
    }
    return "[Error] Incorrect Input Type - Expected (String)";
};
/***
 * - `^`               // start of line
 * - `[a-zA-Z]{2,}`    // will except a name with at least two characters
 * - `\s`              // will look for white space between name and surname
 * - `[a-zA-Z]{1,}`    // needs at least 1 Character
 * - `\'?-?`           // possibility of **'** or **-** for double barreled and hyphenated surnames
 * - `[a-zA-Z]{2,}`    // will except a name with at least two characters
 * - `\s?`             // possibility of another whitespace
 * - `([a-zA-Z]{1,})?` // possibility of a second surname
 *
 * @param value
 *
 * @returns {string | boolean}
 *
 */
const name = (value) => {
    if (!valid(value)) {
        return "[Warning] Input Value Required (Human Identifiable Name)";
    }
    else {
        if (new RegExp("^([a-zA-Z]{2,}\\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\\s?([a-zA-Z]{1,})?)", "g").exec(value) !== null) {
            return true;
        }
    }
    return "[Error] Incorrect Input Type - Expected (String, Human Identifiable Name)";
};
const digit = (value) => {
    if (!valid(value)) {
        return "[Warning] Input Value Required (Digit)";
    }
    return (new RegExp("^(\\d+)$", "g").exec(value) !== null) ? true : "[Error] Incorrect Input Type - Expected (Number)";
};
const empty = (value) => {
    // Expression that matches upon empty input
    // Note: the following expression will match empty input in global, multiline mode
    const expression = new RegExp("((\\r\\n|\\n|\\r)$)|(^(\\r\\n|\\n|\\r))|^\\s*$", "g");
    return (expression.test(value));
};
const valid = (value) => {
    return (!empty(value));
};
const message = (value) => {
    return value;
};
const Validation = {
    characters, digit, empty, valid, message, name
};
/***
 * Note that the following class is meant to act only as
 * a meta definition for inheritance; it cannot be used
 * as context for a prompt.
 */
class Abstract {
    name;
    message;
    validate;
    default;
    defaults;
    constructor(name, message, defaults, validation) {
        this.name = name;
        this.message = message;
        this.defaults = defaults;
        (validation) && Reflect.set(this, "validate", validation);
        this.default = () => {
            return this.defaults;
        };
    }
}
/***
 * For validations, either create an asynchronous class
 * or elect to import the Validation object.
 *
 * @example
 * import Question, { Input, Validation } from "./question";
 *
 * const validation = async ($: any) => {
 *     const result = await new Promise( (resolve) => {
 *         setTimeout( () => resolve($), 10000 );
 *     } );
 *
 *     return Validation.digit( result );
 * };
 *
 * const Name = Input.initialize( "name", "Name", "Jacob" );
 * const Surname = Input.initialize( "surname", "Last-Name", "Sanders" );
 * const Age = Input.initialize( "age", "Age", null, validation);
 *
 * const questions = [
 *     Name,
 *     Surname,
 *     Age
 * ];
 *
 * Question.prompt( questions ).then( (answers) => {
 *     console.log( JSON.stringify( answers, null, 4 ) );
 * } );
 *
 */
class Input extends Abstract {
    type = "input";
    constructor(name, message, defaults, validation) {
        super(name, message, defaults, validation);
    }
    static initialize(name, message, defaults, validation) {
        return new Input(name, message, defaults, validation);
    }
}
/***
 * For validations, either create an asynchronous class
 * or elect to import the Validation object.
 *
 * @example
 * import Question, { Input, Selectable, Validation } from "./question";
 *
 * const validation = async ($: any) => {
 *     const result = await new Promise( (resolve) => {
 *         setTimeout( () => resolve($), 10000 );
 *     } );
 *
 *     return Validation.digit( result );
 * };
 *
 * const Name = Input.initialize( "name", "Name", "Jacob" );
 * const Surname = Input.initialize( "surname", "Last-Name", "Sanders" );
 * const Age = Input.initialize( "age", "Age", null, validation);
 *
 * const List = Selectable.initialize("list", "Selection", ["Test-1", "Test-2"]);
 *
 * const questions = [
 *     Name,
 *     Surname,
 *     Age,
 *
 *     List
 * ];
 *
 * Question.prompt( questions ).then( (answers) => {
 *     console.log( JSON.stringify( answers, null, 4 ) );
 * } );
 *
 */
class Selectable extends Abstract {
    choices;
    type = "list";
    constructor(name, message, array, defaults, validation) {
        super(name, message, defaults, validation);
        this.choices = array;
    }
    static initialize(name, message, array, defaults, validation) {
        return new Selectable(name, message, array, defaults, validation);
    }
}
class Password extends Abstract {
    type = "password";
    constructor(name, message, defaults, validation) {
        super(name, message, defaults, validation);
    }
    static initialize(name, message, defaults, validation) {
        return new Password(name, message, defaults, validation);
    }
}
const Question = $;
export { Input, Password, Selectable, Validation, Question };
export default Question;
//# sourceMappingURL=question.js.map