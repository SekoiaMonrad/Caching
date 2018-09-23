import helpers = require("sekoia/helpers");

class Dictionary<TKey, TValue>
{
    private _values: {
            key: TKey;
            value: TValue;
        }[] = [];

    constructor(private _keyComparer: Sekoia.Caching.IComparer<TKey>)
    {
        helpers.assert.parameterCannotBeNull(_keyComparer, "_keyComparer");
    }

    public add(key: TKey, value: TValue)
    {
        helpers.assert.parameterCannotBeNull(key, "key");
        helpers.assert.parameterCannotBeNull(value, "value");

        if (this.get(key))
            throw new Error("Entry with key already exist.");

        this._values.push({
                key: key,
                value: value
            });
    }

    public get(key: TKey): TValue
    {
        const index = this.indexOf(key);
        if (index === -1)
            return null;

        return this._values[index].value;
    }

    public forEach(action: (key: TKey, value: TValue) => void)
    {
        this._values.forEach(e =>
        {
            action(e.key, e.value);
        });
    }

    public remove(key: TKey)
    {
        const index = this.indexOf(key);
        if (index === -1)
            return;

        this._values.splice(index, 1);
    }

    public set(key: TKey, value: TValue)
    {
        const index = this.indexOf(key);
        if (index === -1)
            this.add(key, value);
        else
        {
            this._values[index] = {
                    key: key,
                    value: value
                };
        }
    }

    private indexOf(key: TKey): number
    {
        for (let i = 0; i < this._values.length; i++)
        {
            const value = this._values[i];
            if (this._keyComparer(key, value.key))
                return i;
        }

        return -1;
    }
}

export = Dictionary;