var Ci = Components.interfaces;
var Cc = Components.classes;

let eventListenerService = Cc["@mozilla.org/eventlistenerservice;1"]
                             .getService(Ci.nsIEventListenerService);

let dbg = new Debugger();
let DOwindow = dbg.addDebuggee(content.window);

let nodes = content.window.document.querySelectorAll("*");
nodes = [content.window].concat(Array.prototype.slice.call(nodes));

for (let node of nodes) {
  let handlers = eventListenerService.getListenerInfoFor(node);
  
  for (let handler of handlers) {
    let debugObj = handler.getDebugObject().QueryInterface(Ci.jsdIValue);
    let script = debugObj.script;
    let fName = handler.type;
    let dom0 = !!node["on" + fName];
    let url = script ? script.fileName : content.document.location.href;
    let line = (dom0 || !script) ? "?" : script.baseLineNumber;
    let nodeName = getNodeName(node);
    
    log("Node: " + nodeName);
    log("Type: " + fName);
    log("DOM0: " + dom0);
    log("Source: " + debugObj.stringValue);
    log("Origin: " + url + ":" + line);
    log("Capturing: " + handler.capturing);
    log("Allows Untrusted: " + handler.allowsUntrusted);
    log("System Event: " + handler.inSystemEventGroup);
    log("---------------------------------------------------------");
  }
}

function getNodeName(node) {
  let nodeName = (node.nodeName + "").toLowerCase();

  if (node.id) {
    nodeName += "#" + node.id;
  }
  if (node.className) {
    nodeName += "." + node.className;
  }
  if (nodeName == "undefined") {
    nodeName = "window " + node.document.location.href;
  }
  return nodeName;
}

dbg.removeDebuggee(DOwindow);

function log(msg) {
  dump(msg + "\n");
}
