using Instool.DAL.Models.Auth;
using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System.Linq.Expressions;

namespace Instool.Authorization.Privileges
{
    public static class Operation
    {
        public static OperationAuthorizationRequirement Create = new() { Name = nameof(Create) };
        public static OperationAuthorizationRequirement Read = new() { Name = nameof(Read) };
        public static OperationAuthorizationRequirement Update = new() { Name = nameof(Update) };
        public static OperationAuthorizationRequirement Delete = new() { Name = nameof(Delete) };
        public static OperationAuthorizationRequirement Submit = new() { Name = nameof(Submit) };

        public static OperationEnum[] GetOperations(string ops)
        {
            return ops
                     .ToCharArray()
                     .Select(op => GetOperation(op))
                     .ToArray();
        }

        public static OperationEnum GetOperation(string op)
        {
            if (op?.Length != 1)
            {
                throw new ArgumentOutOfRangeException(op);
            }

            return GetOperation(op[0]);
        }

        public static OperationEnum GetOperation(OperationAuthorizationRequirement requirement)
        {
            return (OperationEnum)Enum.Parse(typeof(OperationEnum), requirement.Name);
        }

        public static OperationEnum GetOperation(char op)
        {
            return op switch
            {
                'c' => OperationEnum.Create,
                'r' => OperationEnum.Read,
                'u' => OperationEnum.Update,
                'd' => OperationEnum.Delete,
                's' => OperationEnum.Submit,
                _ => throw new ArgumentOutOfRangeException(nameof(op), $"Unexpected operation {op}"),
            };
        }
        public static char GetChar(OperationEnum op)
        {
            return op switch
            {
                OperationEnum.Create => 'c',
                OperationEnum.Read => 'r',
                OperationEnum.Update => 'u',
                OperationEnum.Delete => 'd',
                OperationEnum.Submit => 's',
                _ => throw new ArgumentException("Unknown enum value " + op)
            };
        }

        public static Expression<Func<RolePrivilege, bool>> GetOperationPredicate(OperationEnum op)
        {
            return op switch
            {
                OperationEnum.Create => PredicateBuilder.New<RolePrivilege>(p => p.Create),
                OperationEnum.Read => PredicateBuilder.New<RolePrivilege>(p => p.Read),
                OperationEnum.Update => PredicateBuilder.New<RolePrivilege>(p => p.Update),
                OperationEnum.Delete => PredicateBuilder.New<RolePrivilege>(p => p.Delete),
                OperationEnum.Submit => PredicateBuilder.New<RolePrivilege>(p => p.Submit),
                _ => PredicateBuilder.New<RolePrivilege>(p => false),
            };
        }

        public static IAuthorizationRequirement GetOperationRequirement(OperationEnum op)
        {
            return op switch
            {
                OperationEnum.Create => Create,
                OperationEnum.Read => Read,
                OperationEnum.Update => Update,
                OperationEnum.Delete => Delete,
                OperationEnum.Submit => Submit,
                _ => throw new ArgumentOutOfRangeException(nameof(op))
            };
        }

        public static OperationEnum? ByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return null;
            }
            if (!Enum.TryParse(typeof(OperationEnum), name, false, out object? result))
            {
                throw new ArgumentOutOfRangeException("name", $"{name} is not a valid operation");
            }
            return (OperationEnum?) result;
        }

        public static string AsString(this IEnumerable<OperationEnum> ops)
        {
            return (ops.Contains(OperationEnum.Create) ? "c" : ".") +
                 (ops.Contains(OperationEnum.Read) ? "r" : ".") +
                 (ops.Contains(OperationEnum.Update) ? "u" : ".") +
                 (ops.Contains(OperationEnum.Delete) ? "d" : ".") +
                 (ops.Contains(OperationEnum.Submit) ? "s" : ".");
        }
    }
}
