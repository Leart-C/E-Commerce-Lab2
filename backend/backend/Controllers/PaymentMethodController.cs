using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.Payment;
using backend.Core.Dtos.PaymentMethod;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMethodController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PaymentMethodController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentMethodDto>>> GetPaymentMethods()
        {
            var paymentMethod = await _context.PaymentMethods.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<PaymentMethodDto>>(paymentMethod));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentMethodDto>> GetPaymentMethod(int id)
        {
            var paymentMethod = await _context.PaymentMethods.FindAsync(id);
            if (paymentMethod == null) return NotFound();

            return Ok(_mapper.Map<PaymentMethodDto>(paymentMethod));
        }

        [HttpPost]
        public async Task<ActionResult> CreatePaymentMethod([FromBody]PaymentMethodDto dto)
        {
            var paymentMethod = _mapper.Map<PaymentMethod>(dto);
           

            _context.PaymentMethods.Add(paymentMethod);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPaymentMethod), new { id = paymentMethod.Id }, _mapper.Map<PaymentMethodDto>(paymentMethod));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaymentMethod(int id, [FromBody] PaymentMethodDto dto)
        {
            var paymentMethod = await _context.PaymentMethods.FindAsync(id);
            if (paymentMethod == null) return NotFound();

            _mapper.Map(dto, paymentMethod);
            await _context.SaveChangesAsync();

            return Ok("PaymentMethod Updated Successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymentMethod(int id)
        {
            var paymentMethod = await _context.PaymentMethods.FindAsync(id);
            if (paymentMethod == null) return NotFound();

            _context.PaymentMethods.Remove(paymentMethod);
            await _context.SaveChangesAsync();
            return Ok("PaymentMethod Deleted Successfully");
        }
    }
}
