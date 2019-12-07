/*
 * Accessible Menu
 * Version: 1.0
 * Author: Thomas Mester
 * Repo: https://github.com/hotgeart/accessible-menu
 */

(function($){
  $.fn.accessibleMenu = function (options) {    
    this.each(function() {
      // Default variable
      var el = "#" + this.id;

      // Defaults settings
      var defaults = {
        animation: "none",
        animationSpeed: 'fast'
      };
    
      var settings = $.extend({}, defaults, options);
    
      // Hide all sub menus if the controller is expanded false
      $(el + ' button[aria-expanded="false"]')
        .next("ul")
        .each(function () {
          $(this).hide();
        });
    
      // Handle click
      $("body").on("click", el + " button", function () {
        accessibleMenuToggler($(this));
      });
    
      // Handle keyboard
      $(this).keydown(function (e) {
        e = e || window.event;
        var focused = $(":focus");
    
        if (e.keyCode == "27") {
          // ESC
          if (focused.is('button[aria-expanded="true"]')) {
            accessibleMenuToggler(focused);
          } else {
            var button = focused
              .parent()
              .parent()
              .parent()
              .children("button");
            button.focus();
            accessibleMenuToggler(button);
          }
        } else if (e.keyCode == "37" || e.keyCode == "38") {
          // ARROW LEFT & UP
          e.preventDefault();
          focused
            .parent()
            .prev("li")
            .children("a, button")
            .focus();
        } else if (e.keyCode == "39" || e.keyCode == "40") {
          // ARROW RIGHT & DOWN
          e.preventDefault();
          if(focused.is('button[aria-expanded="true"]')){
            focused
              .next("ul")
              .children('li:first-child')
              .children("a, button")
              .focus();
          } else {
            focused
              .parent()
              .next("li")
              .children("a, button")
              .focus();
          }
        } else if (e.keyCode == "36") {
          // HOME
          e.preventDefault();
          focused
            .parent()
            .parent()
            .children('li:first-child')
            .children('a, button')
            .focus();
        } else if (e.keyCode == "35") {
          // END
          e.preventDefault();
          focused
            .parent()
            .parent()
            .children("li:last-child")
            .children('a, button')
            .focus();
        } else {
          // Normal behavior
        }
      });
    
      // Toggler
      function accessibleMenuToggler(item) {
        var depthString = " > ul > li ";
    
        if (item == false) {
          $(el + ' button[aria-expanded="true"]').each(function () {
            $(this).attr("aria-expanded", false);
            animate($(this), 'close');
          });
        } else {
          $(el + depthString.repeat(getCurrentDepth(item)) + ' button[aria-expanded="true"]')
            .not(item)
            .each(function () {
              $(this).attr("aria-expanded", false);
              animate($(this), 'close');
            });
    
          var ariaExpanded = item.attr("aria-expanded") == "true" ? false : true;
          item.attr("aria-expanded", ariaExpanded);
          animate(item, 'toggle');
        }
      }
    
      // To know which level you are in the menu
      function getCurrentDepth(element) {
        var depth = 0;
    
        for (i = 0; i < element.parents().length; i++) {
          if (element.parents()[i].tagName == "NAV") {
            /*
              We devide by 2 because otherwise it count </li> like a level of depth
              Example:
              ul > li > ul > li => 4 parents but a depth of 2
              So depth = parents / 2
            */
            depth = i / 2;
            break;
          }
        }  
        return depth;
      }

      // Annimate function
      function animate(element, action) {
        switch (settings.animation) {
          case "fade":
            if(action == 'close') {
              element.next("ul").fadeOut(settings.animationSpeed);
            } else if(action == 'open'){
              element.next("ul").fadeIn(settings.animationSpeed);
            } else {
              element.next("ul").fadeToggle(settings.animationSpeed);
            }
            break;
          case "slide":
              if(action == 'close') {
                element.next("ul").slideUp(settings.animationSpeed);
              } else if(action == 'open'){
                element.next("ul").slideDown(settings.animationSpeed);
              } else {
                element.next("ul").slideToggle(settings.animationSpeed);
              }
            break;
          default:
              if(action == 'close') {
                element.next("ul").hide();
              } else if(action == 'open'){
                element.next("ul").show();
              } else {
                element.next("ul").toggle();
              }
          }
      }
    
      $(el + ", " + el + " *").focusout(function (e) {
        if (!$(e.relatedTarget).is(el + ", " + el + " *")) {
          accessibleMenuToggler(false);
        }
      });
    });

    // polyfill
    if (!String.prototype.repeat) {
      String.prototype.repeat = function (count) {
        "use strict";
        if (this == null)
          throw new TypeError("can't convert " + this + " to object");
  
        var str = "" + this;
        // To convert string to integer.
        count = +count;
        // Check NaN
        if (count != count) count = 0;
  
        if (count < 0) throw new RangeError("repeat count must be non-negative");
  
        if (count == Infinity)
          throw new RangeError("repeat count must be less than infinity");
  
        count = Math.floor(count);
        if (str.length == 0 || count == 0) return "";
  
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28)
          throw new RangeError(
            "repeat count must not overflow maximum string size"
          );
  
        var maxCount = str.length * count;
        count = Math.floor(Math.log(count) / Math.log(2));
        while (count) {
          str += str;
          count--;
        }
        str += str.substring(0, maxCount - str.length);
        return str;
      };
    }
  };
}(jQuery));