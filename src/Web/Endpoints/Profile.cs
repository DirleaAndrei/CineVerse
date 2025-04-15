using CineVerse.Application.Common.Interfaces;

namespace CineVerse.Web.Endpoints;

public class Profile : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
        .MapGet(GetIsUserLoggedIn);
    }

    public bool GetIsUserLoggedIn(IIdentityService identityService)
    {
        return identityService.IsUserLoggedIn();
    }

}