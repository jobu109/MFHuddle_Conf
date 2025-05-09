using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace MF_Huddle_Conf
{
    public interface IPower
    {
        object UserObject { get; set; }

        event EventHandler<UIEventArgs> PowerON_btn;
        event EventHandler<UIEventArgs> PowerOFF_btn;

        void PowerON_FB(PowerBoolInputSigDelegate callback);
        void PowerOFF_FB(PowerBoolInputSigDelegate callback);

    }

    public delegate void PowerBoolInputSigDelegate(BoolInputSig boolInputSig, IPower power);

    internal class Power : IPower, IDisposable
    {
        #region Standard CH5 Component members

        private ComponentMediator ComponentMediator { get; set; }

        public object UserObject { get; set; }

        public uint ControlJoinId { get; private set; }

        private IList<BasicTriListWithSmartObject> _devices;
        public IList<BasicTriListWithSmartObject> Devices { get { return _devices; } }

        #endregion

        #region Joins

        private static class Joins
        {
            internal static class Booleans
            {
                public const uint PowerON_btn = 1;
                public const uint PowerOFF_btn = 2;

                public const uint PowerON_FB = 1;
                public const uint PowerOFF_FB = 2;
            }
        }

        #endregion

        #region Construction and Initialization

        internal Power(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.PowerON_btn, onPowerON_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.PowerOFF_btn, onPowerOFF_btn);

        }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            Devices.Add(device);
            ComponentMediator.HookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            Devices.Remove(device);
            ComponentMediator.UnHookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        #endregion

        #region CH5 Contract

        public event EventHandler<UIEventArgs> PowerON_btn;
        private void onPowerON_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = PowerON_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> PowerOFF_btn;
        private void onPowerOFF_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = PowerOFF_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void PowerON_FB(PowerBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.PowerON_FB], this);
            }
        }

        public void PowerOFF_FB(PowerBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.PowerOFF_FB], this);
            }
        }

        #endregion

        #region Overrides

        public override int GetHashCode()
        {
            return (int)ControlJoinId;
        }

        public override string ToString()
        {
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "Power", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            PowerON_btn = null;
            PowerOFF_btn = null;
        }

        #endregion

    }
}
