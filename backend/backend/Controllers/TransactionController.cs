using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.Payment;
using backend.Core.Dtos.PaymentMethod;
using backend.Core.Dtos.Transaction;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TransactionController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactionMethod()
        {
            var transactionMethod = await _context.Transactions.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<TransactionDto>>(transactionMethod));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDto>> GetTransactionByIdMethod(int id)
        {
            var transactionMethod = await _context.Transactions.FindAsync(id);
            if (transactionMethod == null) return NotFound();

            return Ok(_mapper.Map<TransactionDto>(transactionMethod));
        }

        [HttpPost]
        public async Task<ActionResult> CreateTransactionMethod(TransactionDto dto)
        {
            var transactionMethod = _mapper.Map<Transaction>(dto);


            _context.Transactions.Add(transactionMethod);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransactionMethod), new { id = transactionMethod.Id }, _mapper.Map<TransactionDto>(transactionMethod));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTransactionMethod([FromBody] TransactionDto dto)
        {
            var trasnactionMethod = await _context.Transactions.FindAsync(dto.Id);
            if (trasnactionMethod == null) return NotFound();

            _mapper.Map(dto, trasnactionMethod);
            await _context.SaveChangesAsync();

            return Ok("Transaction Updated Successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransactionMethod(int id)
        {
            var transactionMethod = await _context.Transactions.FindAsync(id);
            if (transactionMethod == null) return NotFound();

            _context.Transactions.Remove(transactionMethod);
            await _context.SaveChangesAsync();
            return Ok("Transaction Deleted Successfully");
        }
    }
}
