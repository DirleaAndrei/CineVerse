using CineVerse.Application.Common.Interfaces;

namespace CineVerse.Application.Movies.Queries;

public class GetIsUserLoggedInQueryHandler : IRequest<bool>
{
    private readonly IIdentityService _identityService;
    public GetIsUserLoggedInQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public bool Handle()
    {
        return _identityService.IsUserLoggedIn();
    }
}
