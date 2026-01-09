using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

using TaskManager.Models;
using TaskManager.Data;
namespace TaskManager.API
{
    [Route("tasks")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var tasks = await _context.Tasks
            .Include(t => t.User)
            .Select(t => new
            {
                t.Id,
                t.Title,
                t.IsDone,
                t.UserId,
                User = new
                {
                    t.User.Id,
                    t.User.Email
                }
            })
            .ToListAsync();

        return Ok(tasks);
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TaskItem task)
    {
        var user = await _context.Users.FindAsync(task.UserId);
        if (user == null) return BadRequest("Invalid UserId");

        task.User = user; 
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var result = new TaskItem
        {
            Id = task.Id,
            Title = task.Title,
            IsDone = task.IsDone,
            UserId = task.UserId,
        };

        return CreatedAtAction(nameof(Get), new { id = task.Id }, result);
    }


        [HttpPut("{id}")] 
        public async Task<IActionResult> Update(int id, [FromBody] TaskItem updated)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Title = updated.Title;
            task.IsDone = updated.IsDone;
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
