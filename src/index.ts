import CanvasAdapter from './Adapters/CanvasAdapter/CanvasAdapter';

class GraphicEngine {
    static init(rendererId: string = 'canvas') {
        if (rendererId === 'canvas') return new CanvasAdapter();

        throw Error('Unknown renderer');
    }
}

export default GraphicEngine;