(function(){

var AutoComplete = kendo.ui.AutoComplete;
var input;

module("kendo.ui.AutoComplete initialization", {
    setup: function() {
        input = $("<input>").appendTo(QUnit.fixture);
    },
    teardown: function() {
        kendo.destroy(QUnit.fixture);
    }
});

test("kendoAutoComplete attaches a autocomplete object to target", function() {
    input.kendoAutoComplete({ data: [] });

    ok(input.data("kendoAutoComplete") instanceof AutoComplete);
});

test("data source is initialized from options.dataSource when array is passed", function() {
    var data = [1, 2], autocomplete = new AutoComplete(input, {
        dataSource: data
    });

    ok(autocomplete.dataSource);
    autocomplete.dataSource.read();
    equal(autocomplete.dataSource.data().length, 2);
});

test("data source is initialized from options.dataSource", function() {
    var data = [1, 2], autocomplete = new AutoComplete(input, {
        dataSource: {
            data: data
        }
    });

    ok(autocomplete.dataSource);
    autocomplete.dataSource.read();
    equal(autocomplete.dataSource.data().length, 2);
});

test("do not open on dataSource.query", function() {
    var data = [1, 2], autocomplete = new AutoComplete(input, {
        dataSource: {
            data: data
        }
    });

    autocomplete.dataSource.fetch();

    ok(!autocomplete.popup.visible());
});

test("rendering honers dataTextField", function() {
    var data = [{text: 1}, {text: 2}], autocomplete = new AutoComplete(input, {
        dataSource: data,
        dataTextField: "text"
    });

    autocomplete.dataSource.query();

    equal(autocomplete.ul.children().eq(0).text(), "1");
});

test("autocomplate initializes a UL for its items", function() {
    var autocomplete = new AutoComplete(input, []);

    ok(autocomplete.ul);
    ok(autocomplete.ul.is("ul"));
});

test("autocomplate initializes a popup for its items", function() {
    var autocomplete = new AutoComplete(input, []);

    ok(autocomplete.popup);
    ok(autocomplete.popup instanceof kendo.ui.Popup);
    ok(autocomplete.popup.options.anchor[0], input[0]);
    ok(autocomplete.popup.element[0], autocomplete.ul[0]);
});

test("autocomplete populates its list when the datasource changes", function() {
    var autocomplete = new AutoComplete(input, ["foo", "bar"]);

    autocomplete.dataSource.read();

    equal(autocomplete.ul.children("li").length, 2);
    equal(autocomplete.ul.children("li").first().text(), "foo");
});

test("changing the template", function() {
    var autocomplete = new AutoComplete(input, {
        template: kendo.template("#= data.toUpperCase() #")
    });

    equal(autocomplete.template("foo"), '<li tabindex="-1" role="option" unselectable="on" class="k-item">FOO</li>');
});

test("defining header template", function() {
    var autocomplete = new AutoComplete(input, {
        template: "#= data.toUpperCase() #",
        headerTemplate: "<div>Header</div>"
    });

    var list = autocomplete.list;

    equal(list.children()[0].outerHTML, "<div>Header</div>");
});

test("highlight first item", function() {
    var autocomplete = new AutoComplete(input, {
        dataSource: ["1", "2", "3"],
        highlightFirst: true
    });

    autocomplete.dataSource.query();

    ok(autocomplete.ul.children().eq(0).hasClass("k-state-focused"));
});

test("resetting dataSource detaches the previouse events", 0, function() {
    var autocomplete = new AutoComplete(input);

    var dataSource = autocomplete.dataSource;

    autocomplete._dataSource();

    autocomplete.bind("dataBound", function() {
        ok(false, "Change event is not detached");
    });

    dataSource.read();
});

test("resetting DataSource rebinds the widget", function() {
    var autocomplete = new AutoComplete(input, {
        dataTextField: "text"
    });

    var dataSource = new kendo.data.DataSource({
        data:[{text: 1, value: 1}, {text:2, value:2}]
    });

    autocomplete.setDataSource(dataSource);

    strictEqual(autocomplete.dataSource, dataSource);
});

test("dataItem() returns dataItem depending on passed index", function() {
    var autocomplete = new AutoComplete(input, {
        dataTextField: "text",
        dataSource:[{text: 1, value: 1}, {text:2, value:2}]
    });

    autocomplete.dataSource.read();

    equal(autocomplete.dataItem(1), autocomplete.dataSource.view()[1]);
});

test("dataItem() returns dataItem depending on passed dom elements", function() {
    var autocomplete = new AutoComplete(input, {
        dataTextField: "text",
        dataSource:[{text: 1, value: 1}, {text:2, value:2}]
    });

    autocomplete.dataSource.read();

    equal(autocomplete.dataItem(autocomplete.items()[1]), autocomplete.dataSource.view()[1]);
});

test("dataItem() returns null if no argument", function() {
    var autocomplete = new AutoComplete(input, {
        dataTextField: "text",
        dataSource:[{text: 1, value: 1}, {text:2, value:2}]
    });

    equal(autocomplete.dataItem(), null);
});

test("Value of the autocomplete is empty string when placeholder is used", function() {
    var autocomplete = new AutoComplete(input, {
        placeholder: "input..."
    });

    equal(autocomplete.value(), "");
});

test("destroy method works", function() {
    var autocomplete = new AutoComplete(input, {
        placeholder: "input..."
    });

    autocomplete.destroy();
    ok(true);
});

//loading
test("AutoComplete creates loading element", function() {
    var autocomplete = new AutoComplete(input);

    ok(autocomplete._loading);
});

asyncTest("AutoComplete shows loading icon on progress", 1, function() {
    var autocomplete = new AutoComplete(input);

    autocomplete.dataSource.trigger("progress");

    setTimeout(function() {
        notEqual(autocomplete._loading.css("display"), "none");
        start();
    }, 200);
});

asyncTest("AutoComplete hides loading icon on dataSource change", 1, function() {
    var autocomplete = new AutoComplete(input);

    autocomplete._showBusy();

    setTimeout(function() {
        autocomplete.refresh();

        equal(autocomplete._loading.css("display"), "none");
        start();
    }, 200);
});

test("AutoComplete sets ignoreCase option to false", function() {
    var autocomplete = new AutoComplete(input, {
        dataTextField: "ID",
        dataSource: {
            data: [
                { ID: 1 }
            ],
            schema: {
                model: {
                    fields: {
                        ID: {
                            type: "number"
                        }
                    }
                }
            }
        }
    });

    equal(autocomplete.options.ignoreCase, false);
});

test("readonly() makes input element readonly", function() {
    var autocomplete = new AutoComplete(input);

    autocomplete.readonly();

    equal(autocomplete.element.attr("readonly"), "readonly");
});

test("readonly(false) removes readonly attribute", function() {
    var autocomplete = new AutoComplete(input);

    autocomplete.readonly();
    autocomplete.readonly(false);

    equal(autocomplete.element.attr("readonly"), undefined);
});

test("readonly() removes disabled attribute and disabled class", function() {
    var autocomplete = new AutoComplete(input);

    autocomplete.enable(false);
    autocomplete.readonly();

    equal(autocomplete.element.attr("readonly"), "readonly");
    equal(autocomplete.element.attr("disabled"), undefined);
    ok(autocomplete.wrapper.hasClass("k-state-default"));
    ok(!autocomplete.wrapper.hasClass("k-state-disabled"));
});

test("enable(false) removes readonly attribute and default class", function() {
    var autocomplete = new AutoComplete(input);

    autocomplete.readonly();
    autocomplete.enable(false);

    equal(autocomplete.element.attr("readonly"), undefined);
    equal(autocomplete.element.attr("disabled"), "disabled");
    ok(!autocomplete.wrapper.hasClass("k-state-default"));
    ok(autocomplete.wrapper.hasClass("k-state-disabled"));
});

test("enable() enables widget after readonly()", function() {
    var autocomplete = new AutoComplete(input);

    autocomplete.readonly();
    autocomplete.enable();

    equal(autocomplete.element.attr("readonly"), undefined);
    equal(autocomplete.element.attr("disabled"), undefined);
    ok(autocomplete.wrapper.hasClass("k-state-default"));
    ok(!autocomplete.wrapper.hasClass("k-state-disabled"));
});

test("AutoComplete honors readonly attribute", function() {
    var autocomplete = new AutoComplete(input.attr("readonly", true));

    equal(autocomplete.element.attr("readonly"), "readonly");
    equal(autocomplete.element.attr("disabled"), undefined);
});

test("AutoComplete uses disabled attr over the readonly", function() {
    var autocomplete = new AutoComplete(input.attr("readonly", true).attr("disabled", true));

    equal(input.attr("readonly"), undefined);
});

test("AutoComplete does not focus input if refresh triggered from dataSource", function() {
    var autocomplete = new AutoComplete(input);
    autocomplete.suggest("test");

    notEqual(input[0], document.activeElement);
});

test("AutoComplete uses input value if options.value is null", function() {
    var autocomplete = new AutoComplete(input.val("test"));

    equal(input.val(), "test");
});

}());
