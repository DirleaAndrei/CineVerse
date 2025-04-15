using System.Reflection;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CineVerse.Web.Infrastructure;

public static class WebApplicationExtensions
{
    public static RouteGroupBuilder MapGroup(this WebApplication app, EndpointGroupBase group)
    {
        var groupName = group.GetType().Name;

        return app
            .MapGroup($"/api/{groupName}")
            .WithGroupName(groupName)
            .WithTags(groupName)
            .WithOpenApi();
    }

    public static WebApplication MapEndpoints(this WebApplication app)
    {
        var endpointGroupType = typeof(EndpointGroupBase);

        var assembly = Assembly.GetExecutingAssembly();

        var endpointGroupTypes = assembly.GetExportedTypes()
            .Where(t => t.IsSubclassOf(endpointGroupType));

        foreach (var type in endpointGroupTypes)
        {
            if (Activator.CreateInstance(type) is EndpointGroupBase instance)
            {
                instance.Map(app);
            }
        }

        return app;
    }

    public static IResult HandleResults<T>(Results<Ok<T>, NotFound<T>, StatusCodeHttpResult> result)
    {
        return result switch
        {
            Ok<T> ok => Results.Ok(ok.Value),
            NotFound<T> notFound => Results.NotFound(notFound.Value),
            StatusCodeHttpResult statusCode => Results.StatusCode(statusCode.StatusCode),
            _ => Results.StatusCode(500) // Default to Internal Server Error for unexpected cases
        };
    }

    public static IResult HandleResults<T>(Results<Ok<T>, BadRequest<T>, StatusCodeHttpResult> result)
    {
        return result switch
        {
            Ok<T> ok => Results.Ok(ok.Value),
            BadRequest<T> badRequest => Results.BadRequest(badRequest.Value),
            StatusCodeHttpResult statusCode => Results.StatusCode(statusCode.StatusCode),
            _ => Results.StatusCode(500) // Default to Internal Server Error for unexpected cases
        };
    }
}
