
function Tube () {

    this.handlers = {};

    this.state = {

        programIndex: 0
        
    };

}

Tube.prototype = {

    subscribe: function ( name, handler ) {

        if ( this.handlers[name] == undefined ) {

            this.handlers[name] = {};

        }

        if ( this.handlers[name][handler.name] !== undefined ) {

            return console.warn( 'The handler ' + handler.name + ' for this Message has exist.' );
        }

        this.handlers[name][handler.name] = handler;

    },

    publish: function ( name ) {

        if ( this.handlers[name] == undefined ) {

            return console.error( 'There is no '+ name + ' in Tube.' );

        }

        var handlers = this.handlers[name];

        for ( var _handler in handlers ) {

            handlers[_handler]();

        }
            
    },

    unsubscribe: function ( name, handler ) {

        if ( this.handlers[name][handler.name] == undefined ) {

            return console.warn('No handler: ' + handler.name + ' for ' + name );

        }

        delete this.handlers[name][handler.name];

    },

    once: function ( name ) {

        if ( this.handlers[name] == undefined ) return;

        var handlers = this.handlers[name];

        for ( var _handler in handlers ) {

            handlers[_handler]();

        }

        delete this.handlers[name];

    },

    destroy: function ( name ) {

        if ( this.handlers[name] == undefined ) {

            return console.error( 'No such ' + name + ' in Tube.');

        }

        delete this.handlers[name];

    }
    
};

var TUBE = new Tube();

export { TUBE };


