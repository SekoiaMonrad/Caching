import CompositableBase = require("sekoia/CompositableBase");
import IAuthManagerSettings = require("./IAuthManagerSettings");
import ko = require("knockout");
import $ = require("jquery");
import rx = require("rx");
import helpers = require("sekoia/helpers");
import rest = require("sekoia/rest");

class AuthManager extends CompositableBase<IAuthManagerSettings>
{
    private _prefilterCallbacks = $.Callbacks();

    public isAuthenticated = ko.observable(true);
    public authenticationType = ko.observable<string>();

    public claims = ko.observableArray<IClaim>([]);

    public newClaimType = ko.observable<string>();
    public newClaimValue = ko.observable<string>();

    public echoPrincipal: KnockoutObservable<any>;

    constructor()
    {
        super();
        $.ajaxPrefilter(this._prefilterCallbacks.fire.bind(this));

        this.echoPrincipal = ko.pureComputed(() =>
            {
                return ko.toJSON({
                        isAuthenticated: this.isAuthenticated(),
                        authenticationType: this.authenticationType(),
                        claims: this.claims().slice(0)
                    });
            })
            .toObservableWithReplyLatest()
            .throttle(1000)
            .selectSwitch(() =>
            {
                return rest.get("/api/widgets-tester/auth/echo-principal")
                    .toObservable();
                //.onErrorResumeNext(rx.Observable.return({
                //error: "some error occured calling server"
                //}));
            })
            .select(p =>
            {
                return JSON.stringify(p, null, 2);
            })
            .toKoObservable();
    }

    /**
     * Allows the new object to execute custom activation logic.
     */
    public activate(settings: IAuthManagerSettings)
    {
        this._prefilterCallbacks.add(this.authPrefilter);
        this.addDetachCleanup(rx.Disposable.create(() => this._prefilterCallbacks.remove(this.authPrefilter)));

        for (let i = 0; i < settings.parts.length; i++)
        {
            const part = settings.parts[i];
            if (!part)
                continue;

            if (part.tagName === "authentication-type".toUpperCase())
            {
                (settings as any).bindingContext.ko.applyBindings((settings as any).bindingContext, part);
                this.authenticationType(part.innerText);}

            if (part.tagName === "claim".toUpperCase())
            {
                (settings as any).bindingContext.ko.applyBindings((settings as any).bindingContext, part);

                const type = part.getAttribute("type");
                const value = part.getAttribute("value");

                if (helpers.isNullOrWhitespace(type))
                    continue;

                this.addClaim(type, value);
            }
        }
    }

    public addNewClaim()
    {
        if (helpers.isNullOrWhitespace(this.newClaimType()))
            return;

        this.addClaim(this.newClaimType(), this.newClaimValue());
        this.newClaimType(undefined);
        this.newClaimValue(undefined);
    }

    public addNewClaimIfEnter(d: any, e: KeyboardEvent)
    {
        if (e.keyCode === 13)
        {
            this.addNewClaim();
            ((e.target as HTMLElement).previousSibling.previousSibling as HTMLInputElement).focus();
        }
        return true;
    };

    public removeClaim(claim: IClaim)
    {
        if (!claim)
            return;

        this.claims.remove(claim);
    }

    private addClaim(type: string, value: string)
    {
        this.claims.push({
                isEnabled: ko.observable(true),
                type: ko.observable(type),
                value: ko.observable(value)
            });
    }

    private authPrefilter(o: any): void
    {
        if (!o.beforeSend)
        {
            o.beforeSend = (xhr: any) =>
            {
                const authenticationType = this.authenticationType();
                if (!this.isAuthenticated())
                    xhr.setRequestHeader("Authentication-Type", "");
                else if (!helpers.isNullOrWhitespace(authenticationType))
                    xhr.setRequestHeader("Authentication-Type", authenticationType);

                xhr.setRequestHeader(
                    "Claim",
                    JSON.stringify(this.claims()
                        .filter(claim =>
                        {
                            return claim.isEnabled()
                                && !helpers.isNullOrWhitespace(claim.type())
                                && !helpers.isNullOrWhitespace(claim.value());
                        })
                        .map(claim =>
                        {
                            return {
                                    type: claim.type(),
                                    value: claim.value()
                                };
                        })));
            };
        }
    }
}

interface ICallEchoPrincipalValues
{
    isAuthenticated: boolean;
    authenticationType: string;
    claims: IClaim[];
}

interface IClaim
{
    isEnabled: KnockoutObservable<boolean>;
    type: KnockoutObservable<string>;
    value: KnockoutObservable<string>;
}


export = AuthManager;