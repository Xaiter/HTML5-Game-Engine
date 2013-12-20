/// <reference path="/js/jquery.min.js" />
/// <reference path="/js/engine/Game.js" />
/// <reference path="/js/engine/ActorBase.js" />

function WorldObjectClass(game, width, height) {

    // base "constructor"
    ActorBaseClass.call(this, game, width, height);

    this.isWorldObject = true;    
}
ClassUtility.inheritPrototype(ActorBaseClass, WorldObjectClass);
