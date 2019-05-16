import * as nodes from '../../nodes';
import * as directives from './directives';

const DEFAULT_INTERPRETED_ROLE = 'title-reference';

const roleRegistry = {};
const roles = {};


function setClasses(options) {
    if ('class' in options) {
        options.classes = options.class;
        delete options.class;
    }
}

class GenericRole {
    constructor(roleName, nodeClass) {
        this.name = roleName;
        this.nodeClass = nodeClass;
    }

    /* eslint-disable-next-line no-unused-vars */
    invoke(myRole, rawtext, text, lineno, inliner, options, content) {
        const myOptions = options || {};
        setClasses(myOptions);
        return [[new this.nodeClass(rawtext, unescape(text), [], myOptions)], []];
    }
}
/**
 Add customization options to role functions, unless explicitly set or
 disabled.
 */
function setImplicitOptions(roleFn) {
    if (!Object.prototype.hasOwnProperty.call(roleFn, 'options') || roleFn.options == null) {
        roleFn.options = { class: directives.class_option };
    } else if (!('class' in roleFn.options)) {
        roleFn.options.class = directives.class_option;
    }
}

/**

    Register an interpreted text role by its local or language-dependent name.

    :Parameters:
      - `name`: The local or language-dependent name of the interpreted role.
      - `roleFn`: The role function.  See the module docstring.
    */
function registerLocalRole(name, roleFn) {
    setImplicitOptions(roleFn);
    roles[name] = roleFn;
}


/**
 Locate and return a role function from its language-dependent name, along
 with a list of system messages.  If the role is not found in the current
 language, check English.  Return a 2-tuple: role function (``None`` if the
 named role cannot be found) and a list of system messages.
 */
function roleInterface(roleName, languageModule, lineno, reporter) {
const normname = roleName.toLowerCase();
    const messages = [];
    const msgText = [];

    if (normname in roles) {
        return [roles[normname], messages];
    }

    let canonicalname;
    if (roleName) {
        try {
            canonicalname = languageModule.roles[normname];
        } catch (error) {
            throw error;
            /*

                    except AttributeError, error:
                        msgText.append('Problem retrieving role entry from language '
                                        'module %r: %s.' % (languageModule, error))
                    except KeyError:
                        msgText.append('No role entry for "%s" in module "%s".'
                                        % (roleName, languageModule.__name__))
            */
        }
    } else {
            canonicalname = DEFAULT_INTERPRETED_ROLE;
    }

    // # If we didn't find it, try English as a fallback.
    /*
    if(! canonicalname) {
        try {
            canonicalname = _fallback_languageModule.roles[normname]
            msgText.append('Using English fallback for role "%s".'
                            % roleName)
        except KeyError:
            msgText.append('Trying "%s" as canonical role name.'
                            % roleName)
            # The canonical name should be an English name, but just in case:
            canonicalname = normname
    */
    // Collect any messages that we generated.
    if (msgText.length) {
        const message = reporter.info(msgText.join('\n'), [], { line: lineno });
        messages.append(message);
    }

    // # Look the role up in the registry, and return it.
    if (canonicalname in roleRegistry) {
        const roleFn = roleRegistry[canonicalname];
        registerLocalRole(normname, roleFn);
        return [roleFn, messages];
    }
        return [undefined, messages]; // Error message will be generated by caller.
}

/**
Register an interpreted text role by its canonical name.

:Parameters:
  - `name`: The canonical name of the interpreted role.
  - `roleFn`: The role function.  See the module docstring.
*/
function registerCanonicalRole(name, roleFn) {
    setImplicitOptions(roleFn);
    roleRegistry[name] = roleFn;
}


/** For roles which simply wrap a given `node_class` around the text. */
function registerGenericRole(canonicalName, nodeClass) {
    const myRole = new GenericRole(canonicalName, nodeClass);
    registerCanonicalRole(canonicalName, myRole);
}

registerGenericRole('abbreviation', nodes.abbreviation);
registerGenericRole('acronym', nodes.acronym);
registerGenericRole('emphasis', nodes.emphasis);
registerGenericRole('literal', nodes.literal);
registerGenericRole('strong', nodes.strong);
registerGenericRole('subscript', nodes.subscript);
registerGenericRole('superscript', nodes.superscript);
registerGenericRole('title-reference', nodes.title_reference);

export default roleInterface;
