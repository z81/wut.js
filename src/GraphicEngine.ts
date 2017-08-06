import CanvasAdapter from './Adapters/CanvasAdapter/CanvasAdapter';

export class GraphicEngine {
    static init(rendererId: string = 'canvas') {
        if (rendererId === 'canvas') return new CanvasAdapter();

        throw Error('Unknown renderer');
    }
}