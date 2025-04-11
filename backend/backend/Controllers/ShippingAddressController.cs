using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.ShippingAddress;
using backend.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingAddressController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ShippingAddressController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/ShippingAddress
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShippingAddressDto>>> Get()
        {
            var addresses = await _context.ShippingAddresses
                .Include(sa => sa.User)
                .ToListAsync();

            return Ok(_mapper.Map<List<ShippingAddressDto>>(addresses));
        }

        // GET: api/ShippingAddress/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShippingAddressDto>> Get(int id)
        {
            var address = await _context.ShippingAddresses
                .Include(sa => sa.User)
                .FirstOrDefaultAsync(sa => sa.Id == id);

            if (address == null)
                return NotFound();

            return Ok(_mapper.Map<ShippingAddressDto>(address));
        }

        // POST: api/ShippingAddress
        [HttpPost]
        public async Task<ActionResult<ShippingAddressDto>> Post([FromBody] ShippingAddressDto dto)
        {
            var address = _mapper.Map<ShippingAddress>(dto);
            _context.ShippingAddresses.Add(address);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<ShippingAddressDto>(address);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }

        // PUT: api/ShippingAddress/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ShippingAddressDto dto)
        {
            var existing = await _context.ShippingAddresses.FindAsync(id);
            if (existing == null)
                return NotFound();

            _mapper.Map(dto, existing);
            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ShippingAddress/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var address = await _context.ShippingAddresses.FindAsync(id);
            if (address == null)
                return NotFound();

            _context.ShippingAddresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}