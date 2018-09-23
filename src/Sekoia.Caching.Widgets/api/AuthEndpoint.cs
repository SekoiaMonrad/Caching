using System;
using System.Linq;
using JetBrains.Annotations;
using Sekoia.Nancy;
using Sekoia.Security;

namespace Sekoia.WidgetsTester.Api
{
    public class AuthEndpoint : NancyModuleWithoutTrackTraceBase
    {
        private readonly IAuthorizer _authorizer;

        public AuthEndpoint([NotNull] IAuthorizer authorizer)
        {
            if (authorizer == null)
                throw new ArgumentNullException(nameof(authorizer));

            _authorizer = authorizer;
        }

        [Get("/api/widgets-tester/auth/echo-principal")]
        public object EchoPrincipal()
        {
            var principal = _authorizer.CurrentPrincipal;
            return new
                   {
                       identities = principal.Identities
                                             .Select(i => new
                                                          {
                                                              i.AuthenticationType,
                                                              i.IsAuthenticated,
                                                              i.Label,
                                                              Claims = i.Claims
                                                                        .Select(c => new
                                                                                     {
                                                                                         c.Type,
                                                                                         c.Value
                                                                                     })
                                                                        .Execute()
                                                          })
                                             .Execute()
                   };
        }
    }
}
