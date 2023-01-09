using Instool.DAL.Repositories;
using Instool.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Instool.API
{
    [ApiController]
    [ApiVersion("1")]
    [Route("api/v{version:apiVersion}/files")]
    public class FileApiController : ControllerBase
    {

        private readonly IFileRepository _repo;

        public FileApiController(IFileRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("{fileId}")]
        public async Task<FileStreamResult> GetFile([FromRoute] int fileId)
        {
            var file = await _repo.Get(fileId);
            if (file == null)
            {
                throw new HttpResponseException(StatusCodes.Status404NotFound);
            }
            try
            {

                byte[] imageBytes = Convert.FromBase64String(file.Content);
                MemoryStream stream = new(imageBytes, 0,
                  imageBytes.Length);

                // Convert byte[] to Image
                stream.Write(imageBytes, 0, imageBytes.Length);
                stream.Position = 0;

                return File(stream, "image/jpeg", file.Filename);
            }
            catch (Exception e)
            {
                throw new HttpResponseException(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
