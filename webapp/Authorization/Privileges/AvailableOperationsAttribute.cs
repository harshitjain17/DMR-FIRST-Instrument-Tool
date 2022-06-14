﻿// Copyright (c) 2018 Jon P Smith, GitHub: JonPSmith, web: http://www.thereformedprogrammer.net/
// Licensed under MIT license. See License.txt in the project root for license information.

using System;
using System.Linq;

namespace Instool.Authorization.Privileges
{
    [AttributeUsage(AttributeTargets.Field)]
    public class AvailableOperationsAttribute : Attribute
    {
        private string _operations;

        public OperationEnum[] AvailableOperations
        {
            get
            {
                return Operation.GetOperations(_operations);
            }
        }




        public AvailableOperationsAttribute(string operations)
        {
            _operations = operations;
        }
    }
}