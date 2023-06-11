if (!window["softalks.com/html/forms"]) {
    window["softalks.com/html/forms"] = "forms"
}

window[window["softalks.com/html/forms"]] = new function() {
    const root = "softalks.com/html/form";
    const model = window[root + "s/model"]
    let many = root + "s/titles"
    let one = root + "/titles"
    let focused = false
    let titles = window[many]
    if (!titles && window[one]) {
        titles = {
            default: window[one]
        }
    }
    many = root + "s/placeholders"
    one = root + "/placeholders"
    let placeholders = window[many]
    if (!placeholders && window[one]) {
        placeholders = {
            default: window[one]
        }
    }

    function errorOn(element, message) {
        if (element.title) {
            element.previousTitle = element.title
        }
        element.addEventListener("input", function() {
            element.classList.remove("com_softalks_Error")
            if (element.previousTitle) {
                element.title = element.previousTitle
            } else {
                delete (element.title)
            }
        })
        element.title = element.title ? message + ". Expected: " + element.title : message
        element.className = "com_softalks_Error"
        if (!focused) {
            focused = true
            element.focus()
            element.select()
            element.scrollIntoView()
        }
    }

    function named(element, formName) {
        if (!element.title && titles) {
            let title = titles[formName][element.name]
            if (title) {
                element.title = title
            }
        }
        if (!element.placeholder && placeholders) {
            let placeholder = placeholders[formName][element.name]
            if (placeholder) {
                element.placeholder = placeholder
            }
        }
        let formModel = getFormModel(element)
        if (formModel) {
            if (formModel.values && formModel.values[element.name]) {
                if (element.tagName == "INPUT" && (!element.type || element.type == "text")) {
                    element.value = formModel.values[element.name]   
                } else {
                    throw "Not implemented yet"
                }
            }
            let error = model.error
            if (error) {
                let fields = error.fields
                if (fields && error.form == formName) {
                    let message = fields[element.name]
                    if (message) {
                        errorOn(element, message, formModel)
                    }
                }
            }
        }
    }

    window.addEventListener("DOMContentLoaded", function() {
        for (let currentForm of document.forms) {
            if (!currentForm.name) {
                currentForm.name = "default"
            }
            let formName = currentForm.name
            for (let element of currentForm.elements) {
                if (element.name) {
                    named(element, formName)
                }
            }
        }
    })

    function getFormModel(field) {
        if (!model) {
            return
        }
        let form = field.form
        if (!form) {
            return null
        }
        form = form.name
        if (form) {
            form = model[form]
            if (form) {
                return form
            } else if (model.default) {
                return model.default
            } else {
                return null
            }
        } else {
            if (model.default) {
                return model.default
            } else {
                return null
            }
        }
    }

    Object.defineProperty(this, "feedback", {
        get: function() {
            if (!model) {
                return
            }
            let form = model.default
            if (model.error && model.error.message) {
                return model.error.message? model.error.message: "error"
            } else if (model.ok) {
                return model.ok.message? model.ok.message : "ok"
            } else {
                return null
            }
        }
    })

    this.input = function(type, name, html) {
        return function() {
            this.type = type
            this.name = name
            if (html) {
                html.call(this)
            }
        }
    }

    this.text = function(name, html) {
        return this.input("text", name, html)
    }

}