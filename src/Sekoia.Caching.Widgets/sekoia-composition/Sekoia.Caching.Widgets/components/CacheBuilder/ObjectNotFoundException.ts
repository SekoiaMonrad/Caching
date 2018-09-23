
class ObjectNotFoundException
{
    private _err: string;

    constructor(err: string)
    {
        this._err = err;
    }
}

export = ObjectNotFoundException;