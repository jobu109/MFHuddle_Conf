using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace MF_Huddle_Conf
{
    public interface ISlidersGauges
    {
        object UserObject { get; set; }

        event EventHandler<UIEventArgs> level_set;

        void level_fb(SlidersGaugesUShortInputSigDelegate callback);
        void label(SlidersGaugesStringInputSigDelegate callback);

    }

    public delegate void SlidersGaugesUShortInputSigDelegate(UShortInputSig uShortInputSig, ISlidersGauges slidersGauges);
    public delegate void SlidersGaugesStringInputSigDelegate(StringInputSig stringInputSig, ISlidersGauges slidersGauges);

    internal class SlidersGauges : ISlidersGauges, IDisposable
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
            internal static class Numerics
            {
                public const uint level_set = 1;

                public const uint level_fb = 1;
            }
            internal static class Strings
            {

                public const uint label = 1;
            }
        }

        #endregion

        #region Construction and Initialization

        internal SlidersGauges(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            ComponentMediator.ConfigureNumericEvent(controlJoinId, Joins.Numerics.level_set, onlevel_set);

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

        public event EventHandler<UIEventArgs> level_set;
        private void onlevel_set(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = level_set;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void level_fb(SlidersGaugesUShortInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].UShortInput[Joins.Numerics.level_fb], this);
            }
        }


        public void label(SlidersGaugesStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.label], this);
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
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "SlidersGauges", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            level_set = null;
        }

        #endregion

    }
}
