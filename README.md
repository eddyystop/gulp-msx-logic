# [gulp-msx-logic](https://github.com/eddyystop/gulp-msx-logic)

Gulp plugin for adding flow logic to 
[msx templates] (https://github.com/insin/msx)
for [Mithril] (http://lhorie.github.io/mithril/). 
It should work for React's 
[JSX] (http://facebook.github.io/react/docs/jsx-in-depth.html)
as well.

JSX and msx are logic-less templates AND, once a tag is encountered,
they expect only HTML until that outer-most tag is closed.
This makes them awkward to use should you, for example,
want to render <option> tags for a list obtained via AJAX.

This plugin allows you to embed JS flow control statements in templates.

### Syntax

This mxs template
```
/** @jsx m */
mc.selectAjax = {
  controller : function (options) {
    options = options || {};
    this.value = typeof options.option === 'function' ? options.option() : options.option;

    this.onchange = function (e) {
      this.value = e.target.options[e.target.selectedIndex].value;
      if (typeof options.value === 'function') { options.value(this.value); }
      if (options.onclickTab) { options.onclickTab(this.value); }
    }.bind(this);
  },

  view : function (ctrl, options) {
    return <select class="form-control" onchange={ctrl.onchange}>
        {/*% options.items.map(function (item) { %*/}
          {/*% return %*/}<option>{item.name}</option>
        {/*% }) %*/}
      </select>;
  }
};
```
will be transformed into
```
/** @jsx m */
mc.selectAjax = {
  controller : function (options) {
    options = options || {};
    this.value = typeof options.option === 'function' ? options.option() : options.option;

    this.onchange = function (e) {
      this.value = e.target.options[e.target.selectedIndex].value;
      if (typeof options.value === 'function') { options.value(this.value); }
      if (options.onclickTab) { options.onclickTab(this.value); }
    }.bind(this);
  },

  view : function (ctrl, options) {
    return m("select", {class:"form-control", onchange:ctrl.onchange}, [
         options.items.map(function (item) { 
           return m("option", [item.name])
         }) 
      ]);
  }
};
```

### Usage

Include the following in your Gulp pipeline after the mxs transform:
```
.pipe(require('gulp-msx-logic')({showFiles:true}))
```

`showFiles` may be a string, true or false (default).

### Tests
```
gulp test
```