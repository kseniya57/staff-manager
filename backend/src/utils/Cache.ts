import {execute} from './mysql';
import {EventEmitter} from 'events';

export const UPDATED_CACHE_EVENT = 'updated';

export class QueryCache extends EventEmitter {
    private readonly store: {[index: string]: any[]};
    private readonly keys: string[];
    private readonly queries: string[];
    private readonly process: (data: any[]) => any[];

    constructor(
        interval: number,
        queries: { [index: string]: string},
        timeout: number = 0,
        process?: (data: any[]) => any[],
    ) {
        super();
        this.store = {};
        this.keys = Object.keys(queries);
        this.queries = Object.values(queries);
        this.process = process || (data => data);
        setInterval(this.update.bind(this), interval);
        setTimeout(this.update.bind(this), timeout);
    }

    get(key?: string) {
        return key ? this.store[key] : this.store
    }

    private update() {
        return Promise.all(this.queries.map(query => execute(query)))
            .then((results: any[][]) => {
                results.forEach((item, index) => (this.store[this.keys[index]] = this.process(item)))
                this.emit(UPDATED_CACHE_EVENT)
            })
            .catch(console.error)
    }
}

export class FunctionCache<T> extends EventEmitter {
    private store: T;
    private readonly params: any[];
    private readonly f: (...params: any[]) => Promise<T>;

    constructor(
        interval: number,
        f:  (...params: any[]) => Promise<T>,
        ...params: any[]
    ) {
        super();
        this.f = f;
        this.params = params;
        setInterval(this.update.bind(this), interval);
        this.update();
    }

    get() {
        return this.store
    }

    private update() {
        this.f(...this.params).then(this.set.bind(this))
    }

    private set(data: T) {
        this.store = data;
        this.emit(UPDATED_CACHE_EVENT)
    }
}
