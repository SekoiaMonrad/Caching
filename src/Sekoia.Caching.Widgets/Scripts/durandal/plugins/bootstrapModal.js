define(['plugins/dialog', 'durandal/app', 'knockout'], function(dialog, app, ko) {
    dialog.addContext('bootstrapModal', {
        blockoutOpacity: .2,
        removeDelay: 300,
        addHost: function(theDialog) {
            if (!window.bootstrapModalNo)
                window.bootstrapModalNo = 0;
            window.bootstrapModalNo++;
            
            var host = $('#bootstrapModal' + window.bootstrapModalNo);
            if ( host.length === 0 )
            {
                var body = $('body'),
                    backdrop = theDialog.owner.autoclose ? true : 'static',
                    keyboard = theDialog.owner.autoclose ? true : false;
                host = $('<div class="modal fade" id="bootstrapModal'  + window.bootstrapModalNo + '" tabindex="-1" role="dialog" data-keyboard="' + keyboard + '" data-backdrop="' + backdrop +'" aria-labelledby="bootstrapModal" aria-hidden="true"></div>')
                        .appendTo(body);
            }
            theDialog.host = host.get(0);
            $(theDialog.host).on('shown.bs.modal', function() {
                // Make sure modal-open is on body
                $('body').addClass('modal-open');
                // Set focus on first .autofocus
                var autofocusField = $(theDialog.host).find(".autofocus");
                if (autofocusField.length)
                    autofocusField[0].focus();
            });
        },
        removeHost: function(theDialog) {
            $(theDialog.host).modal('hide');
            // Only remove modal-open if we are the last dialog
            if ($('.modal[role=dialog]').length === 1) {
                $('body').removeClass('modal-open');
            }
        },
        attached: null,
        compositionComplete: function(child, parent, context) {
            var theDialog = dialog.getDialog(context.model);
            var options = {};
            options.show = true;
            $(theDialog.host).modal(options);
            $(theDialog.host).on('hidden.bs.modal', function(e) {
                theDialog.close();
                ko.removeNode(theDialog.host);
                // Only remove backdrop if we are the last dialog
                if ($('.modal[role=dialog]').length === 1) {
                    $('.modal-backdrop').remove();
                }
            });
        }
    });

    var bootstrapModal = function() {};
    bootstrapModal.install = function() {
        dialog.MessageBox.prototype.compositionComplete = function(child, parent, context) {
            var theDialog = dialog.getDialog(context.model);
            var $child = $(child);
            if ($child.hasClass('autoclose') || context.model.autoclose) {
                $(theDialog.blockout).click(function() {
                    theDialog.close();
                });
            }
        };
    };
    return bootstrapModal;
});